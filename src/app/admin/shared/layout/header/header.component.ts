import { Component } from '@angular/core';
import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'hami-header',
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
