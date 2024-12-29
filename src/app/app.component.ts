import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import {BreadcrumbDirective} from './core/directives/breadcrumb.directive';
// import {IBreadcrumb} from './core/interfaces/breadcrumb';

@Component({
  selector: 'hami-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cimdata-front';
  // items: IBreadcrumb[] = [];
}
