import { Component } from '@angular/core';
import {LogoComponent} from '../logo/logo.component';

@Component({
  selector: 'hami-sidebar',
  imports: [
    LogoComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
