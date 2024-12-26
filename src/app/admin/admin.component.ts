import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from './shared/layout/sidebar/sidebar.component';
import {HeaderComponent} from './shared/layout/header/header.component';

@Component({
  selector: 'hami-admin',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
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
