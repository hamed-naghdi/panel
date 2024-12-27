import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {IBreadcrumb} from '../interfaces/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  public getBreadcrumbs$(): Observable<IBreadcrumb[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.createBreadcrumb(this.activatedRoute))
    )
  }

  public createBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<IBreadcrumb> = []): Array<IBreadcrumb> {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0)
      return breadcrumbs;

    for (const child of children) {
      const routeUrl: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeUrl !== '')
        url += `/${routeUrl}`;

      const label = child.snapshot.data['breadcrumb']
      if (label) {
        breadcrumbs.push({
          label: child.snapshot.data['breadcrumb'],
          url: url
        });
      }

      return this.createBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
