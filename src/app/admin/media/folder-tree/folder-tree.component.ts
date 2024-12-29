import {Component, OnInit} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {NgOptimizedImage} from '@angular/common';
import { MessageService, TreeNode } from 'primeng/api';
import {Tree} from 'primeng/tree';

@Component({
  selector: 'hami-folder-tree',
  imports: [
    HlmButtonDirective,
    NgOptimizedImage,
    Tree
  ],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent implements OnInit {

  files: TreeNode[] = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
            { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
            { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
          ]
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
        }
      ]
    },
  ];
  selectedFile!: TreeNode;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  nodeExpand(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Node Expanded', detail: event.node.label });
  }

  nodeCollapse(event: any) {
    this.messageService.add({ severity: 'warn', summary: 'Node Collapsed', detail: event.node.label });
  }

  nodeSelect(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
  }

  nodeUnselect(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.label });
  }
}
