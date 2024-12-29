import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { MessageService, TreeNode } from 'primeng/api';
import {Tree} from 'primeng/tree';

import { environment } from '../../../../environments/environment';
import {MediaService} from '../../../core/services/api/media.service';

@Component({
  selector: 'hami-folder-tree',
  imports: [
    HlmButtonDirective,
    Tree
  ],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent implements OnInit, OnDestroy {

  getDirectorSubscription: Subscription | undefined;

  directories: TreeNode[] = [];

  selectedFolder?: TreeNode;

  constructor(private messageService: MessageService,
              private mediaService: MediaService,
              private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.directories = this.initiateTree();
    this.directories.map((node) => (node.loading = false));
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.getDirectorSubscription) {
      this.getDirectorSubscription.unsubscribe();
    }
  }

  private initiateTree(): TreeNode[] {
    return [
      {
        key: '/',
        label: 'root',
        data: '',
        icon: 'pi pi-folder',
        leaf: false,
        loading: true,
      }
    ]
  }

  protected createFolder(): void {
    if (!this.selectedFolder)
      return;

    console.log(this.selectedFolder.key)
  }

  nodeExpand(event: any) {
    // this.messageService.add({ severity: 'success', summary: 'Node Expanded', detail: `${event.node.label} | ${event.node.data}` });

    console.log('nodeExpand', event);

    if (!event.node.children) {
      let _key = event.node.key;
      if (!_key)
        _key = '/';

      const node = this.directories.find((item) => item.key === _key);

      if (!node)
        return;

      event.node.loading = true;

      this.getDirectorSubscription = this.mediaService.getDirectory(_key).subscribe((data) => {

        let _node = { ...event.node };
        _node.children = data.directories?.map((item) => {
          return {
            key: `${_key}${item}/`,
            label: item,
            data: item,
            icon: 'pi pi-folder',
            leaf: false,
            loading: false,
          }
        })

        node.children = _node.children;

        event.node.loading = false;
        this.cd.markForCheck();
      })

      // setTimeout(() => {
      //   let _node = { ...event.node };
      //   _node.children = [];
      //
      //   for (let i = 0; i < 3; i++) {
      //     _node.children.push({
      //       key: event.node.key + '-' + i,
      //       label: 'Lazy ' + event.node.label + '-' + i
      //     });
      //   }
      //
      //   const key = parseInt(_node.key, 10);
      //   this.directories[key] = { ..._node, loading: false };
      //   this.cd.markForCheck();
      // }, 500);
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
