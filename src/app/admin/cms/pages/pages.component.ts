import {Component, OnInit, computed, signal, WritableSignal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {PaginatorState} from 'primeng/paginator';
import {Skeleton} from 'primeng/skeleton';

import {CmsService} from '../../../core/services/api/cms.service';
import {AppSettings} from '../../../core/constants/AppSettings';
import {CmsPage} from '../../../core/models/cms/entities/cmsPage';

@Component({
  selector: 'hami-pages',
  imports: [
    TableModule,
    Skeleton
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})

export class PagesComponent implements OnInit {
  // // Define a signal with an initial value of 0
  // counter = signal(0);
  //
  // // A computed signal based on the counter signal
  // doubleCounter = computed(() => this.counter() * 2);
  //
  // // Method to increment the counter
  // increment() {
  //   this.counter.update((value) => value + 1);
  // }
  //
  // // Method to decrement the counter
  // decrement() {
  //   this.counter.update((value) => value - 1);
  // }

  loading: WritableSignal<boolean> = signal(false);
  pages: WritableSignal<CmsPage[]> = signal([]);

  first = 0;
  rows = 10;
  options = AppSettings.DEFAULT_PAGINATOR_OPTIONS;

  constructor(private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.loading.update(() => true);

    const ob$ = this.cmsService.getPagesList()
    .subscribe(apiResult => {
      console.log(apiResult);

      if (apiResult && apiResult.data && apiResult.data.items){
        const items = apiResult.data.items;
        this.pages.update(() => items);
      }

      this.loading.update(() => false);
    })
  }

  onPageChange(event: PaginatorState) {
    if (event.first)
      this.first = event.first;

    if (event.rows)
      this.rows = event.rows;
  }
}
