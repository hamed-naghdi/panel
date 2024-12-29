import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {filter, map} from 'rxjs/operators';
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

  getDirectory(directoryPath: string): Observable<IDirectory> {
    const options = {
      params: new HttpParams().set('directoryPath', directoryPath),
    }

    return this.httpClient
      .get<IApiResult<IDirectory>>(`media/directory/get`, options).pipe(
        map(result => {
          if (result.succeeded) {
            return result.data as IDirectory;
          } else {
            this.messageService.add({ severity: 'error', summary: result.message, detail: `No details found.` });
            // return result.data as IDirectory;
            throw new Error(result.message);
          }
        }),
        catchError((error) => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: `Error Happened`, detail: `No details found.` });
          return of();
        })
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
          this.messageService.add({ severity: 'error', summary: `Error Happened`, detail: `No details found.` });
          return of();
        })
      )
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('API error:', error);
      throw error;
    };
  }
}
