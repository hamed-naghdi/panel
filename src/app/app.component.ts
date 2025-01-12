import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoadingIndicatorComponent} from './shared/loading-indicator/loading-indicator.component';

// import {BreadcrumbDirective} from './core/directives/breadcrumb.directive';
// import {IBreadcrumb} from './core/models/breadcrumb';

@Component({
  selector: 'hami-root',
  imports: [RouterOutlet, LoadingIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cimdata-front';
  // items: IBreadcrumb[] = [];
}
