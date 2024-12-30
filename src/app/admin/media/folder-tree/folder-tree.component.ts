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

import { environment } from '../../../../environments/environment';
import {MediaService} from '../../../core/services/api/media.service';
import {TreeService} from '../../../core/services/tree.service';
import {LoggerService} from '../../../core/services/logger.service';

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
    Validators.minLength(3),
  ])


  getDirectorySubscription: Subscription | undefined;

  tree: TreeNode[] = [];

  selectedFolder?: TreeNode;

  constructor(private messageService: MessageService,
              private mediaService: MediaService,
              private treeService: TreeService,
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

  nodeExpand(event: any) {
    // this.messageService.add({ severity: 'success', summary: 'Node Expanded', detail: `${event.node.label} | ${event.node.data}` });

    this.loggerService.log('nodeExpand', event.node.key);
    this.loggerService.log(event.node.children)


    if (!event.node.children) {
      let _key = event.node.key;
      if (!_key)
        _key = '/';

      this.loggerService.log(this.tree)

      //this.tree.find((item) => item.key === _key);
      const node = event.node;

      if (!node)
        return;

      // event.node.loading = true;
      node.loading = true;

      this.getDirectorySubscription = this.mediaService.getDirectory(_key).subscribe({
        next: (apiResult) => {
          if (!apiResult.succeeded) {
            event.node.loading = false;
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
          const children = this.mediaService.convertDirectoryDataToTreeNode(apiResult.data, _key);
          this.treeService.updateNode(node, children);
          this.cd.markForCheck();
        },
        error: (err) => {
          node.loading = false;
          this.messageService.add({ severity: 'error', summary: `Server is unavailable`, detail: `try again later` });
        },
        complete: () => {}
      })
    }
  }

  nodeCollapse(event: any) {
    // this.messageService.add({ severity: 'warn', summary: 'Node Collapsed', detail: event.node.label });
  }

  nodeSelect(event: any) {
    // console.log(this.selectedFolder);
    // this.messageService.add({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
  }

  nodeUnselect(event: any) {
    // console.log(this.selectedFolder);
    // this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.label });
  }
}
