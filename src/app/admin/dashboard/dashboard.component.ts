import {Component, OnInit} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {TreeNode} from 'primeng/api';
import {TemplateEnum} from '../../core/models/cms/enums/templateEnum';

@Component({
  selector: 'hami-dashboard',
  imports: [
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  template: TemplateEnum | undefined;

  // files: TreeNode[] = [
  //   {
  //     key: '0',
  //     label: 'Documents',
  //     data: 'Documents Folder',
  //     icon: 'pi pi-fw pi-inbox',
  //     children: [
  //       {
  //         key: '0-0',
  //         label: 'Work',
  //         data: 'Work Folder',
  //         icon: 'pi pi-fw pi-cog',
  //         children: [
  //           { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
  //           { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
  //         ]
  //       },
  //       {
  //         key: '0-1',
  //         label: 'Home',
  //         data: 'Home Folder',
  //         icon: 'pi pi-fw pi-home',
  //         children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
  //       }
  //     ]
  //   },
  // ];

  constructor() {
    this.template = TemplateEnum.fromDisplayName('Home');
  }

  ngOnInit(): void {
  }
}
