import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Subscription} from 'rxjs';

import {SearchService} from '../../../core/services/search.service';

@Component({
  selector: 'hami-search',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
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
