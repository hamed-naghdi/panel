import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, toArray} from 'rxjs';

import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {SearchComponent} from '../../search/search.component';
import {RoutingService} from '../../../../core/services/routing.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'hami-header',
  imports: [
    BreadcrumbComponent,
    SearchComponent,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSearchable = false;
  searchSubscription: Subscription | undefined = undefined;

  constructor(private routingService: RoutingService,) {
  }

  ngOnInit(): void {

    // Check on initial load
    this.isSearchable = this.routingService.isSearchable()

    // Subscribe to router events for dynamic navigation updates
    this.searchSubscription = this.routingService.hasSearch()
      .subscribe((result) => {
        this.isSearchable = result;
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription)
      this.searchSubscription.unsubscribe();
  }
}
