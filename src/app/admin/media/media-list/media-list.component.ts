import {Component, Input, OnInit} from '@angular/core';
import {IDirectory} from '../../../core/interfaces/media/directory';

import {normalizePath} from '../../../core/utilities/commonHelper';
import {MediaCardComponent} from '../media-card/media-card.component';
import {IFile} from '../../../core/interfaces/media/file';
import {MediaService} from '../../../core/services/api/media.service';
import {Button} from 'primeng/button';
import {FileUpload} from 'primeng/fileupload';

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
export class MediaListComponent implements OnInit {
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

  constructor(private mediaService: MediaService) {
  }

  ngOnInit(): void {
  }
}
