import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LogoComponent} from './shared/layout/logo/logo.component';

@Component({
  selector: 'hami-admin',
  imports: [
    RouterOutlet,
    LogoComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
