import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

import {FolderTreeComponent} from './folder-tree/folder-tree.component';
import {MediaListComponent} from './media-list/media-list.component';
import {IDirectory} from '../../core/interfaces/media/directory';

@Component({
  selector: 'hami-media',
  imports: [
    SplitterModule,
    FolderTreeComponent,
    MediaListComponent,
  ],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent {
  dir: IDirectory | undefined;

  constructor() {
  }

  protected nodeSelected(directory: IDirectory) {
    this.dir = directory;
  }
}
