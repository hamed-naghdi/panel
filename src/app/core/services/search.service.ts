import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public navigationEnd$: Observable<NavigationEnd> | null = null;

  constructor(private router: Router) {
    this.navigationEnd$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );
  }

  private hasSearch(route: ActivatedRoute): boolean {
    return route.snapshot.data['search'] === true;
  }

  public isSearchable(route: ActivatedRoute): boolean {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0)
      return false;

    for (const child of children) {
      if (this.hasSearch(child))
        return true;

      this.isSearchable(child);
    }

    return false;
  }
}
