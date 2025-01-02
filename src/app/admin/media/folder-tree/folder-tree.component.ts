import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, exhaustMap, of, Subject, Subscription} from 'rxjs';
import {MessageService, TreeNode} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import {Tree} from 'primeng/tree';

import {MediaService} from '../../../core/services/api/media.service';
import {LoggerService} from '../../../core/services/logger.service';
import {ErrorService} from '../../../core/services/error.service';
import {arraysEqual} from '../../../core/utilities/arrayHelper';
import {treeDesignToken} from '../../shared/common/treeDesignToken';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {FormService} from '../../../core/services/form.service';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'hami-folder-tree',
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    Tree,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddon,
  ],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent implements OnInit, OnDestroy {
  protected readonly treeDesignToken = treeDesignToken;

  visibleCreateFolderDialog: boolean = false;
  pathErrors: string[] = [];
  submitCreateFolder$: Subject<FormGroup> = new Subject();
  createFolderGroup: FormGroup = new FormGroup({
    newFolderName: new FormControl('', [
      Validators.required,
      // Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9-_ ]{1,255}$/)
    ])
  });

  getDirectorySubscription: Subscription | undefined;
  createDirectorySubscription: Subscription | undefined;

  tree: TreeNode[] = [];
  selectedFolder?: TreeNode;

  constructor(private messageService: MessageService,
              private mediaService: MediaService,
              private loggerService: LoggerService,
              private errorService: ErrorService,
              private formService: FormService,
              private cd: ChangeDetectorRef) {
    // this.loggerService.debug(this.profileForm instanceof FormGroup, this.profileForm2 instanceof FormGroup, this.profileForm3 instanceof FormGroup);
  }

  //#region ng

  ngOnInit(): void {
    this.tree = this.initiateTree();
    this.tree.map((node) => (node.loading = false));
    this.cd.markForCheck();

    this.createDirectorySubscription = this.submitCreateFolder$.pipe(
      filter(form => form.valid),
      map(form => {
        const newFolderName = form.get('newFolderName')?.value as string;
        return {
          ...form.value,
          path: this.generateFolderPath(newFolderName, this.selectedFolder?.key),
        };
      }),
      exhaustMap((transformedFormData) => {
        return this.mediaService.createDirectory(transformedFormData.path).pipe(
          catchError((error) => {
            this.handleCreateFolderErrors(error)
            return of()
          }),
        );
      })
    ).subscribe({
      next: apiResult => {
        if (!apiResult.succeeded)
          return;

        // empty errors
        this.pathErrors = []

        const newFolderName = this.createFolderGroup.get('newFolderName')?.value as string;
        // const path = apiResult.data?.path;
        const path = this.generateFolderPath(newFolderName, this.selectedFolder?.key);
        const newNode: TreeNode = {
          key: path,
          label: newFolderName,
          data: path,
          icon: 'pi pi-folder',
          leaf: true,
          loading: false,
        }
        this.addNode(newNode);
        this.messageService.add({ severity: 'success', summary: `'${newFolderName}' successfully created` });
        this.closeDialog();
      },
      error: error => this.handleCreateFolderErrors(error),
      complete: () => {}
    })
  }

  ngOnDestroy(): void {
    if (this.getDirectorySubscription) {
      this.getDirectorySubscription.unsubscribe();
    }

    if (this.createDirectorySubscription) {
      this.createDirectorySubscription.unsubscribe();
    }
  }

  //#endregion

  //#region tree view

  private initiateTree(): TreeNode[] {
    return [
      {
        key: '/',
        label: 'root (/)',
        data: '/',
        icon: 'pi pi-folder',
        leaf: false,
        loading: true,
      }
    ]
  }

  protected areChildrenEquals(node: TreeNode, children: TreeNode[] | undefined ): boolean {
    if (node.children === undefined && children === undefined)
      return true;

    if (node.children === undefined)
      return false;

    const nodeChildrenKeys = (node.children as TreeNode[])
      .map((child: TreeNode) => child.key)
      .filter((item) => item !== undefined);

    const childrenKeys = (children as TreeNode[])
      .map((child: TreeNode) => child.key)
      .filter((item) => item !== undefined);

    return arraysEqual(nodeChildrenKeys, childrenKeys);
  }

  protected loadNode(node: TreeNode): void {
    if (!node)
      return;

    if (!node.key)
      node.key = '/';

    node.loading = true;

    this.getDirectorySubscription = this.mediaService.getDirectory(node.key).subscribe({
      next: (apiResult) => {
        if (!apiResult.succeeded) {
          // node.loading = false;
          const errors = apiResult.errors;
          if (!errors)
            return;
          for (let key in errors){
            for (let error in errors[key]){
              this.messageService.add({
                key: key,
                severity: 'error',
                summary: error
              })
            }
          }
          return;
        }
        const children = this.mediaService.convertDataToTreeNode(apiResult.data, node.key!);

        if (!this.areChildrenEquals(node, children)){
          node.children = [];

          if (children && children.length > 0) {
            node.children = children;
          } else {
            node.leaf = true;
          }
        }

        // node.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        node.loading = false;
        this.messageService.add({ severity: 'error', summary: `Server is unavailable`, detail: `try again later` });
      },
      complete: () => {
        node.loading = false;
      }
    })
  }

  private addNode(node: TreeNode): void {
    if (this.selectedFolder !== undefined && this.selectedFolder.children !== undefined) {
      this.selectedFolder.children.push(node);
    }
  }

  //#endregion

  //#region create folder

  private resetCreateFolderForm(form: FormGroup): void {
    form.patchValue({
      newFolderName: ''
    })
  }

  protected openDialog(): void {
    if (!this.selectedFolder)
      return;

    const folder = this.selectedFolder.key;
    if (!folder)
      return;

    this.visibleCreateFolderDialog = true;
  }

  protected closeDialog(): void {
    this.resetCreateFolderForm(this.createFolderGroup);
    this.visibleCreateFolderDialog = false;
  }

  private generateFolderPath(newFolderName: string, selectedFolderPath?: string): string {
    const normalizedPath = selectedFolderPath?.replace(/\/+$/, '') + '/';
    return `${normalizedPath}${newFolderName}/`
  }

  protected onCreateFolderFormSubmit(): void {
    this.submitCreateFolder$.next(this.createFolderGroup);
  }

  //#endregion

  //#region errors

  private handleCreateFolderErrors(error: any): void {
    this.errorService.notifyErrors(error);
    this.errorService.setServerErrors(this.createFolderGroup, error, [
      {
        serverKey: 'Path',
        formKey: 'newFolderName'
      }
    ]);
    this.pathErrors = this.formService.getServerFormErrors('newFolderName', this.createFolderGroup);
  }

  //#endregion

  nodeExpand(event: any) {
    // this.messageService.add({ severity: 'success', summary: 'Node Expanded', detail: `${event.node.label} | ${event.node.data}` });

    const node = event.node as TreeNode;
    if (!node.children) {
      this.loadNode(node);
    }
  }

  nodeCollapse(event: any) {
    // this.messageService.add({ severity: 'warn', summary: 'Node Collapsed', detail: event.node.label });
  }

  nodeSelect(event: any) {
    const node = event.node as TreeNode;
    // this.loggerService.warn(node.key)
    this.loadNode(node);
  }

  nodeUnselect(event: any) {
    // this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.label });
  }
}
