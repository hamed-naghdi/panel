import { Component } from '@angular/core';
import {FolderTreeComponent} from './folder-tree/folder-tree.component';

@Component({
  selector: 'hami-media',
  imports: [
    FolderTreeComponent
  ],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent {

}
