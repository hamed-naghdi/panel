import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import { MessageService, TreeNode } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {Tree} from 'primeng/tree';

import {MediaService} from '../../../core/services/api/media.service';
import {LoggerService} from '../../../core/services/logger.service';
import { arraysEqual } from '../../../core/utilities/arrayHelper';

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
  ],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent implements OnInit, OnDestroy {

  visibleCreateFolderDialog: boolean = false;
  createFolderGroup!: FormGroup;
  newFolderName = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ])


  getDirectorySubscription: Subscription | undefined;

  tree: TreeNode[] = [];

  selectedFolder?: TreeNode;

  constructor(private messageService: MessageService,
              private mediaService: MediaService,
              private loggerService: LoggerService,
              private cd: ChangeDetectorRef) {

    this.createFolderGroup = new FormGroup({
      newFolderName: this.newFolderName,
    })
  }

  ngOnInit(): void {
    this.tree = this.initiateTree();
    this.tree.map((node) => (node.loading = false));
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.getDirectorySubscription) {
      this.getDirectorySubscription.unsubscribe();
    }
  }

  private initiateTree(): TreeNode[] {
    return [
      {
        key: '/',
        label: 'root',
        data: '/',
        icon: 'pi pi-folder',
        leaf: false,
        loading: true,
      }
    ]
  }

  protected openDialog(): void {
    if (!this.selectedFolder)
      return;

    const folderRoot = this.selectedFolder.key;
    if (!folderRoot)
      return;

    this.visibleCreateFolderDialog = true;
  }

  protected createFolder(): void {
    const form = this.createFolderGroup;
    if (!form.valid)
      return;

    this.visibleCreateFolderDialog = false;

    console.log(form.value)
    console.log(this.newFolderName.value);

    this.newFolderName.setValue('');
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
          node.loading = false;
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

        node.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        node.loading = false;
        this.messageService.add({ severity: 'error', summary: `Server is unavailable`, detail: `try again later` });
      },
      complete: () => {}
    })
  }

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
    // console.log(this.selectedFolder);
    // this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.label });
  }
}
