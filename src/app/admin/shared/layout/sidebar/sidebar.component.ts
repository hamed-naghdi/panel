import { Component } from '@angular/core';
import {LogoComponent} from '../logo/logo.component';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'hami-sidebar',
  imports: [
    LogoComponent,
    MenuComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
