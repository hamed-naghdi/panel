import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Toast} from 'primeng/toast';

import {SidebarComponent} from './shared/layout/sidebar/sidebar.component';
import {HeaderComponent} from './shared/layout/header/header.component';
import {SearchComponent} from './shared/search/search.component';

@Component({
  selector: 'hami-admin',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    SearchComponent,
    Toast
  ],
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.panel.scss',
    './admin.component.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent {

}
