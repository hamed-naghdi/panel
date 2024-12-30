import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {filter, map, retry} from 'rxjs/operators';
import {catchError, Observable, of, tap} from 'rxjs';
import { MessageService } from 'primeng/api';

import {IDirectory} from '../../interfaces/media/IDirectory';
import {IApiResult} from '../../interfaces/IApiResult';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private readonly httpClient: HttpClient,
              private readonly messageService: MessageService) {
  }

  getDirectory(directoryPath: string): Observable<IApiResult<IDirectory>> {
    const options = {
      params: new HttpParams().set('directoryPath', directoryPath),
    }

    return this.httpClient
      .get<IApiResult<IDirectory>>(`media/directory/get`, options).pipe(
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
