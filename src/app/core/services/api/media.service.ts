import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpParams} from '@angular/common/http';
import {delay, map, retry} from 'rxjs/operators';
import {catchError, Observable, of, tap} from 'rxjs';

import {IDirectory} from '../../interfaces/media/IDirectory';
import {IApiResult} from '../../interfaces/IApiResult';
import {LoadingService} from '../loading.service';
import {SkipLoading} from '../../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private readonly httpClient: HttpClient,
              private readonly loadingService: LoadingService,) {
  }

  getDirectory(directoryPath: string): Observable<IApiResult<IDirectory>> {
    // this.loadingService.loadingOn()
    const options = {
      context: new HttpContext().set(SkipLoading, true),
      params: new HttpParams().set('directoryPath', directoryPath),
    }

    return this.httpClient
      .get<IApiResult<IDirectory>>(`media/directory/get`, options).pipe(
        // delay(2000),
        retry(3),
        catchError(this.handleError())
      );
  }

  createDirectory(path: string): Observable<void> {
    const options = {}
    return this.httpClient
      .post<IApiResult<{path: string}>>(`media/create`, { path: path }, options).pipe(
        map(result => {
          console.log(result)
        }),
        catchError((error) => {
          console.log(error);

          return of();
        })
      )
  }

  private handleError() {
    return (error: any) => {
      console.error('API error:', error);
      // this.messageService.add({ severity: 'error', summary: `Error Happened`, detail: `No details found.` });
      return of(error);
    };
  }
}
