import {Component, OnInit} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';
import {TreeNode} from 'primeng/api';
import {Tree} from 'primeng/tree';

@Component({
  selector: 'hami-dashboard',
  imports: [
    HlmButtonDirective,
    ButtonModule,
    FormsModule,
    ToggleButton,
    Tree
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  checked: boolean = false;
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

  constructor() {
  }

  ngOnInit(): void {
  }
}
