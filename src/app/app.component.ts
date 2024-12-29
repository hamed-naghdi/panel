import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';

// import {BreadcrumbDirective} from './core/directives/breadcrumb.directive';
// import {IBreadcrumb} from './core/interfaces/breadcrumb';

@Component({
  selector: 'hami-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService
  ]
})
export class AppComponent {
  title = 'cimdata-front';
  // items: IBreadcrumb[] = [];
}
