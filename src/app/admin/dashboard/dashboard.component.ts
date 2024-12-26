import {Component, OnInit} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'hami-dashboard',
  imports: [
    HlmButtonDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // this.breadcrumbs = this.breadcrumbService.breadcrumbs;
    // console.log(this.breadcrumbs);
  }
}
