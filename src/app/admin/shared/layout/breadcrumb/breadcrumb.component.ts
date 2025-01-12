import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';

import {IBreadcrumb} from '../../../../core/models/breadcrumb';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'hami-breadcrumb',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<IBreadcrumb> = [];
  breadcrumbSubscription: Subscription | undefined;

  title: string = '';
  back?: IBreadcrumb;

  constructor(private breadcrumbService: BreadcrumbService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    // Check on initial load
    this.breadcrumbs = this.breadcrumbService.createBreadcrumb(this.activatedRoute);
    this.updateBreadcrumbsView()

    // Subscribe to router events for dynamic navigation updates
    this.breadcrumbSubscription = this.breadcrumbService.getBreadcrumbs$()
      .subscribe((breadcrumbs: Array<IBreadcrumb>) => {
        this.breadcrumbs = breadcrumbs;

        this.updateBreadcrumbsView()
      });
  }

  ngOnDestroy(): void {
    if (this.breadcrumbSubscription) {
      this.breadcrumbSubscription.unsubscribe();
    }
  }

  private updateBreadcrumbsView() {
      if (this.breadcrumbs.length > 0)
        this.title = this.breadcrumbs[this.breadcrumbs.length - 1].label;

      if (this.breadcrumbs.length > 1)
        this.back = this.breadcrumbs[this.breadcrumbs.length - 2]
  }
}
