import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {catchError, exhaustMap, of, Subject, Subscription, tap} from 'rxjs';
import {FormsModule} from '@angular/forms';

import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FileUpload, FileUploadHandlerEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';

import {IDirectory} from '../../../core/models/media/directory';
import {normalizePath} from '../../../core/utilities/commonHelper';
import {MediaCardComponent} from '../media-card/media-card.component';
import {IFile} from '../../../core/models/media/file';
import {IUploadRequest, IUploadResponse} from '../../../core/models/media/IUpload';
import {MediaService} from '../../../core/services/api/media.service';
import {ErrorService} from '../../../core/services/error.service';
import {isApiResult} from '../../../core/utilities/apiTypeGuard';
import {IApiResult, IServerSideError} from '../../../core/models/apiResult';
import IErrorDescriber from '../../../core/models/errorDescriber';

@Component({
  selector: 'hami-media-list',
  imports: [
    MediaCardComponent,
    Button,
    FileUpload,
    Dialog,
    FormsModule
  ],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.scss'
})
export class MediaListComponent implements OnInit, OnDestroy {
  private _directory: IDirectory | undefined;
  @Input('directoryInfo')
  get directory(): IDirectory | undefined {
    return this._directory;
  }
  set directory(value: IDirectory | undefined) {
    const directory = normalizePath(value?.directoryPath);
    const files: IFile[] | undefined = value?.files?.map(f => {
      const fullPath = this.mediaService.getMediaLink(directory, f.fileName);
      return {
        id: f.id,
        size: f.size,
        fileName: f.fileName,
        fullPath: fullPath
      }
    })
    this._directory = {
      directoryPath: directory,
      directories: value?.directories,
      files: files
    };
  }

  @ViewChild(FileUpload, { read : FileUpload }) uploader: FileUpload | undefined;
  protected visibleDialog: boolean = false;

  upload$: Subject<IUploadRequest> = new Subject<IUploadRequest>();
  uploadSubscription: Subscription | undefined;

  constructor(private mediaService: MediaService,
              private errorService: ErrorService,
              private messageService: MessageService,) {
  }

  ngOnInit(): void {
    this.upload$.pipe(
      exhaustMap((uploadRequest) => {
        return this.mediaService.uploadFiles(uploadRequest).pipe(
          catchError((error) => {
            this.handleUploadErrors(error);
            return of()
          })
        );
      })
    ).subscribe({
      next: apiResult => {
        if (!apiResult.succeeded)
          return;

        if (apiResult.data)
          this.showUploadedFiles(apiResult.data, this.uploader!.files)

        this.hideDialog();
        this.messageService.add({ severity: 'success', summary: `files uploaded successfully` });
      },
      error: error => {
        this.handleUploadErrors(error);
      },
      complete: () => {}
    })
  }

  ngOnDestroy(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  showDialog(): void {
    this.visibleDialog = true;
  }

  hideDialog(): void {
    this.uploader?.clear();
    this.visibleDialog = false;
  }

  uploadFiles(event: FileUploadHandlerEvent): void {
    if (!this._directory || event.files.length === 0) return;

    const request: IUploadRequest = {
      files: event.files,
      directory: this._directory.directoryPath
    }

    this.upload$.next(request);
  }

  showUploadedFiles(apiFiles: IUploadResponse[], files: File[]): void {
    const result: IFile[] = apiFiles.map((file, index) => {
      return {
        id: file.id,
        size: files[index].size,
        fileName: files[index].name,
        fullPath: this.mediaService.getMediaDownloadLink(file.filePath)
      }
    })
    this.directory?.files?.push(...result);
  }

  //#region errors

  handleUploadErrors(error: any): void  {
    this.errorService.notifyErrors(error);
    const extractedErrors = this.processErrors(error)
    if (extractedErrors) {
      type errorMessageType = {
        severity: string,
        summary: string,
        detail?: string,
      }
      const errorMessages: errorMessageType[] = []
      for (const key in extractedErrors) {
        errorMessages.push({
          severity: 'error',
          summary: key,
          detail: extractedErrors[key]
        })
      }
      this.messageService.addAll(errorMessages);
    }
  }

  processErrors(error: any) {
    if (error.error instanceof ErrorEvent || !isApiResult(error.error))
      return;

    const serverError = error.error as IApiResult<any>;
    const apiErrors: IServerSideError | undefined = serverError.errors;
    if (!apiErrors)
      return;

    type extractedErrors = { [key: string]: string };
    const extractedErrors: extractedErrors = {};

    for (let key in apiErrors) {
      const errorDescribers: IErrorDescriber[] = apiErrors[key]
      if (key.startsWith('files[')) {
        const fileIndex = this.extractFileIndex(key);
        if (fileIndex !== null && this.uploader?.files[fileIndex]){
          const file = this.uploader?.files[fileIndex];
          extractedErrors[file?.name] = errorDescribers.map(e => e.description).join('\n ')
        }
      } else {
        extractedErrors[key] = errorDescribers.map(e => e.description).join('\n ')
      }
    }

    return extractedErrors;
  }

  extractFileIndex(key: string): number | null {
    const match = key.match(/files\[(\d+)]/);
    return match ? parseInt(match[1], 10) : null;
  }

  //#endregion
}
