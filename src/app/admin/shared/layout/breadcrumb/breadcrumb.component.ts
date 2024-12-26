import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';

import {IBreadcrumb} from '../../../../core/interfaces/breadcrumb';
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
  navEndSubscription: Subscription | undefined;

  title: string = '';
  back?: IBreadcrumb;

  constructor(private breadcrumbService: BreadcrumbService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.navEndSubscription = this.breadcrumbService.navigationEnd$?.subscribe(() => {
      this.breadcrumbs = this.breadcrumbService.createBreadcrumb(this.activatedRoute.root)
      // console.log('breadcrumb', this.breadcrumbs);
      if (this.breadcrumbs.length > 0)
        this.title = this.breadcrumbs[this.breadcrumbs.length - 1].label;

      if (this.breadcrumbs.length > 1)
        this.back = this.breadcrumbs[this.breadcrumbs.length - 2]
    });
  }

  ngOnDestroy(): void {
    if (this.navEndSubscription) {
      this.navEndSubscription.unsubscribe();
    }
  }
}
