import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  public hasSearch$() {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.isSearchable())
    );
  }

  public isSearchable(): boolean {
    let currentRout = this.activatedRoute.root;
    while (currentRout.firstChild){
      currentRout = currentRout.firstChild;
    }
    // console.log(currentRout.snapshot.data['search'])
    return currentRout.snapshot.data['search'] === true;
  }
}
