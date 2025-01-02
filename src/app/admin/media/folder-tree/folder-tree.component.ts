import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  catchError,
  distinctUntilChanged,
  exhaustMap,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap, tap
} from 'rxjs';
import {filter, finalize, map} from 'rxjs/operators';

import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {MessageService, TreeNode} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import {Tree} from 'primeng/tree';

import {treeDesignToken} from '../../shared/common/treeDesignToken';
import {arraysEqual} from '../../../core/utilities/arrayHelper';

import {MediaService} from '../../../core/services/api/media.service';
import {LoggerService} from '../../../core/services/logger.service';
import {ErrorService} from '../../../core/services/error.service';
import {FormService} from '../../../core/services/form.service';
import {IApiResult} from '../../../core/interfaces/apiResult';
import {IDirectory} from '../../../core/interfaces/media/directory';

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
  createDirectorySubscription: Subscription | undefined;
  createFolderGroup: FormGroup = new FormGroup({
    newFolderName: new FormControl('', [
      Validators.required,
      // Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9-_ ]{1,255}$/)
    ])
  });

  tree: TreeNode[] = [];

  selectedNode?: TreeNode;
  nodeSelected$: Subject<TreeNode> = new Subject<TreeNode>();
  nodeSelectedSubscription: Subscription | undefined;

  expandedNode?: TreeNode;
  nodeExpanded$: Subject<TreeNode> = new Subject<TreeNode>();
  nodeExpandedSubscription: Subscription | undefined;




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
          path: this.generateFolderPath(newFolderName, this.selectedNode?.key),
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
        const path = this.generateFolderPath(newFolderName, this.selectedNode?.key);
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

    this.nodeExpandedSubscription = this.getDir$(this.nodeExpanded$).subscribe({
      next: (apiResult) => {
        const node = this.expandedNode;
        if (!node) return;
        this.loadChildren(node, apiResult);
      },
      error: (error) => {
        if (this.expandedNode)
          this.expandedNode.loading = false;

        this.messageService.add({ severity: 'error', summary: `Unknown Error`, detail: `try again later` });
      },
      complete: () => {}
    })

    this.nodeSelectedSubscription = this.getDir$(this.nodeSelected$).subscribe({
      next: (apiResult) => {
        const node = this.selectedNode;
        if (!node) return;
        this.loadChildren(node, apiResult);
      },
      error: (error) => {
        if (this.selectedNode)
          this.selectedNode.loading = false;

        this.messageService.add({ severity: 'error', summary: `Unknown Error`, detail: `try again later` });
      },
      complete: () => {}
    })
  }

  ngOnDestroy(): void {
    if (this.nodeSelectedSubscription) {
      this.nodeSelectedSubscription.unsubscribe();
    }

    if (this.nodeExpandedSubscription) {
      this.nodeExpandedSubscription.unsubscribe();
    }

    if (this.createDirectorySubscription) {
      this.createDirectorySubscription.unsubscribe();
    }
  }

  //#endregion

  //#region tree

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

  protected loadChildren(node: TreeNode, apiResult: IApiResult<IDirectory>): void {
    const children = this.mediaService.convertDataToTreeNode(apiResult.data, node.key!);

    if (!this.areChildrenEquals(node, children)){
      node.children = [];
      if (children && children.length > 0)
        node.children = children;
      else
        node.leaf = true;
    }
  }

  private addNode(node: TreeNode): void {
    if (this.selectedNode !== undefined && this.selectedNode.children !== undefined) {
      this.selectedNode.children.push(node);
    }
  }

  private getDir$(source$: Observable<TreeNode>) {
    return source$.pipe(
      switchMap(node => {
        let path = node.key;
        if (!path) path = '/';

        return this.mediaService.getDirectory(path).pipe(
          catchError((error) => {
            this.messageService.add({ severity: 'error', summary: `Server is unavailable`, detail: `try again later` });
            return of()
          }),
          finalize(() => {
            node.loading = false;
            this.cd.markForCheck();
          })
        )
      }),
      filter((apiResult) => apiResult.succeeded)
    )
  }

  //#endregion

  //#region create folder

  private resetCreateFolderForm(form: FormGroup): void {
    this.pathErrors = []
    form.patchValue({
      newFolderName: ''
    })
  }

  protected openDialog(): void {
    if (!this.selectedNode)
      return;

    const folder = this.selectedNode.key;
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
    const node = event.node as TreeNode;
    if (!node.children) {
      node.loading = true;
      this.expandedNode = node;
      this.nodeExpanded$.next(node);
    }
  }

  nodeCollapse(event: any) {
    this.expandedNode = undefined;
  }

  nodeSelect(event: any) {
    const node = event.node as TreeNode;
    this.nodeSelected$.next(node);
  }

  nodeUnselect(event: any) {
  }
}
