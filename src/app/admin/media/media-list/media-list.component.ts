import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {catchError, exhaustMap, of, Subject, Subscription, tap} from 'rxjs';

import {Button} from 'primeng/button';
import {FileUpload, FileUploadHandlerEvent} from 'primeng/fileupload';

import {IDirectory} from '../../../core/interfaces/media/directory';
import {normalizePath} from '../../../core/utilities/commonHelper';
import {MediaCardComponent} from '../media-card/media-card.component';
import {IFile} from '../../../core/interfaces/media/file';
import {MediaService} from '../../../core/services/api/media.service';
import {IUploadRequest} from '../../../core/interfaces/media/IUpload';

@Component({
  selector: 'hami-media-list',
  imports: [
    MediaCardComponent,
    Button,
    FileUpload
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

  upload$: Subject<IUploadRequest> = new Subject<IUploadRequest>();
  uploadSubscription: Subscription | undefined;

  constructor(private mediaService: MediaService) {
  }

  ngOnInit(): void {
    this.upload$.pipe(
      // tap(x => console.log(x)),
      exhaustMap((uploadRequest) => {
        return this.mediaService.uploadFiles(uploadRequest).pipe(
          catchError((error) => {
            console.log(error);

            return of()
          })
        );
      })
    ).subscribe({
      next: data => {},
      error: err => {},
      complete: () => {}
    })
  }

  ngOnDestroy(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  uploadFiles(event: FileUploadHandlerEvent): void {
    if (!this._directory || event.files.length === 0) return;

    const request: IUploadRequest = {
      files: event.files,
      directory: this._directory.directoryPath
    }

    this.upload$.next(request);
  }
}
