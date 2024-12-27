import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {Subscription} from 'rxjs';
import {SearchService} from '../../../../core/services/search.service';

@Component({
  selector: 'hami-header',
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSearchable = false;
  searchSubscription: Subscription | undefined = undefined;

  constructor(private searchService: SearchService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchService.navigationEnd$?.subscribe(() => {
      this.isSearchable = this.searchService.isSearchable(this.activatedRoute)
    })
  }

  ngOnDestroy(): void {
    if (this.searchSubscription)
      this.searchSubscription.unsubscribe();
  }
}
