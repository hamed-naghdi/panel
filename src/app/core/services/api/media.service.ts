import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpParams} from '@angular/common/http';
import {delay, map, retry} from 'rxjs/operators';
import {Observable, catchError, of, tap} from 'rxjs';
import {TreeNode} from 'primeng/api';

import {IDirectory} from '../../interfaces/media/directory';
import {IApiResult} from '../../interfaces/apiResult';
import {SkipLoading} from '../../interceptors/loading.interceptor';
import {LoggerService} from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private readonly httpClient: HttpClient,
              private readonly loggerService: LoggerService,) {
  }

  getDirectory(directoryPath: string): Observable<IApiResult<IDirectory>> {
    const options = {
      context: new HttpContext().set(SkipLoading, true),
      params: new HttpParams().set('directoryPath', directoryPath),
    }

    return this.httpClient
      .get<IApiResult<IDirectory>>(`media/directory/get`, options).pipe(
        // delay(500),
        retry(3),
        catchError(this.handleError())
      );
  }

  convertDataToTreeNode(data: IDirectory | undefined, key: string): TreeNode[] | undefined {
    return data?.directories?.map((item) => {
      return {
        key: `${key}${item}/`,
        label: item,
        data: item,
        icon: 'pi pi-folder',
        leaf: false,
        loading: false,
      }
    })
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
      this.loggerService.error(error);
      // this.messageService.add({ severity: 'error', summary: `Error Happened`, detail: `No details found.` });
      // return of(error);
      throw error;
    };
  }
}
