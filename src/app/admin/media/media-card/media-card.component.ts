import {Component, Input, OnInit} from '@angular/core';

import {MediaService} from '../../../core/services/api/media.service';
import {IFile} from '../../../core/models/media/file';

@Component({
  selector: 'hami-media-card',
  imports: [],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss'
})
export class MediaCardComponent implements OnInit {
  @Input('media') media: IFile | undefined;

  constructor(private mediaService: MediaService) { }

  ngOnInit() {

  }
}
