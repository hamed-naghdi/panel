import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, catchError, tap} from 'rxjs';
import {delay} from 'rxjs/operators';
import {TreeNode} from 'primeng/api';

import {environment} from '../../../../environments/environment';
import {IDirectory} from '../../models/media/directory';
import {IApiResult} from '../../models/apiResult';
import {SkipLoading} from '../../interceptors/loading.interceptor';
import {ICreateDirectoryResponse} from '../../models/media/createDirectory';
import {ErrorService} from '../error.service';
import {normalizePath, removeTrailingSlashes} from '../../utilities/commonHelper';
import {IUploadRequest, IUploadResponse} from '../../models/media/IUpload';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private readonly httpClient: HttpClient,
              private readonly errorService: ErrorService,) {
  }

  getDirectory(directoryPath: string): Observable<IApiResult<IDirectory>> {
    const options = {
      context: new HttpContext().set(SkipLoading, true),
      params: new HttpParams().set('directoryPath', directoryPath),
    }

    return this.httpClient
      .get<IApiResult<IDirectory>>(`media/directory/get`, options).pipe(
        // delay(2000),
        catchError((error) => this.errorService.catchHttpError(error))
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

  createDirectory(path: string): Observable<IApiResult<ICreateDirectoryResponse>> {
    const options = {
      // context: new HttpContext().set(SkipLoading, true),
    }
    return this.httpClient
      .post<IApiResult<ICreateDirectoryResponse>>(`media/directory/create`, { path: path }, options).pipe(
        catchError((error) => this.errorService.catchHttpError(error)),
      )
  }

  uploadFiles(uploadRequest: IUploadRequest): Observable<IApiResult<IUploadResponse[]>> {
    const formData = new FormData();
    uploadRequest.files.forEach((file) => {
      formData.append('files', file);
    })
    formData.append('directory', uploadRequest.directory);

    const options = {
      headers: new HttpHeaders().set('File-Upload', 'true'),
    }
    return this.httpClient
      .post<IApiResult<IUploadResponse[]>>(`media/upload`, formData, options).pipe(
        catchError((error) => this.errorService.catchHttpError(error)),
      )
  }

  getMediaDownloadLink(filePath: string){
    const relativePath = normalizePath('/media/download', filePath);
    const path = removeTrailingSlashes(relativePath);
    return `${environment.apiUrl}${path}`;
  }

  getMediaLink(directory: string, fileName: string): string {
    const relativePath = normalizePath(directory, fileName);
    return this.getMediaDownloadLink(relativePath);
  }

  // private handleError() {
  //   return (error: any) => {
  //     this.loggerService.error(error);
  //     // this.messageService.add({ severity: 'error', summary: `Error Happened`, detail: `No details found.` });
  //     // return of(error);
  //     throw error;
  //   };
  // }
}
