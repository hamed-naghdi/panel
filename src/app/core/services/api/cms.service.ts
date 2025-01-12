import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpParams} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

import {IApiResult} from '../../models/apiResult';
import {CmsPage} from '../../models/cms/entities/cmsPage';
import {ErrorService} from '../error.service';
import {SkipLoading} from '../../interceptors/loading.interceptor';
import {IPaginatedList} from '../../models/paginatedList';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  constructor(private readonly httpClient: HttpClient,
              private readonly errorService: ErrorService,) { }

  getPagesList() : Observable<IApiResult<IPaginatedList<CmsPage>>> {
    const options = {
      context: new HttpContext().set(SkipLoading, true),
      params: new HttpParams()
        .set('pageNumber', 1)
        .set('pageSize', 7)
        .set('ascending', false),
    }

    return this.httpClient.get<IApiResult<IPaginatedList<CmsPage>>>(`cms/pages/get`, options).pipe(
      delay(2000),
      catchError((error) => this.errorService.catchHttpError(error))
    );
  }
}
