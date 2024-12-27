import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, toArray} from 'rxjs';
import {NgOptimizedImage} from '@angular/common';

import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {SearchComponent} from '../../search/search.component';
import {SearchService} from '../../../../core/services/search.service';

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

  constructor(private searchService: SearchService,) {
  }

  ngOnInit(): void {

    // Check on initial load
    this.isSearchable = this.searchService.isSearchable()

    // Subscribe to router events for dynamic navigation updates
    this.searchSubscription = this.searchService.hasSearch$()
      .subscribe((result) => {
        this.isSearchable = result;
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription)
      this.searchSubscription.unsubscribe();
  }
}
