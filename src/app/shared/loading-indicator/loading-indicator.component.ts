// source: https://blog.angular-university.io/angular-loading-indicator/

import {Component, OnInit, Input, ContentChild, TemplateRef, OnDestroy} from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {Observable, Subscription, tap} from 'rxjs';

import {ProgressSpinner} from 'primeng/progressspinner';

import {LoadingService} from '../../core/services/loading.service';

@Component({
  selector: 'hami-loading-indicator',
  imports: [
    AsyncPipe,
    ProgressSpinner,
    NgTemplateOutlet
  ],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss'
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  subscription: Subscription | undefined;

  @Input() detectRouteTransitions: boolean = false;
  @ContentChild('loading') loadingIndicator: TemplateRef<any> | null = null;

  constructor(private loadingService: LoadingService, private router: Router) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    if (this.detectRouteTransitions) {
      this.subscription = this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn()
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff()
            }
          })
        ).subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
