import { Component } from '@angular/core';
import {FolderTreeComponent} from './folder-tree/folder-tree.component';
import { SplitterModule } from 'primeng/splitter';
import {style} from '@angular/animations';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'hami-media',
  imports: [
    SplitterModule,
    FolderTreeComponent,
    Skeleton,
  ],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent {
  protected readonly style = style;
}
