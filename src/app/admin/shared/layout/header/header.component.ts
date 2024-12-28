import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'hami-header',
  imports: [
    BreadcrumbComponent,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
