import { Injectable } from '@angular/core';
import {ITree} from '../interfaces/media/tree';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor() { }

  public updateNode(node: any, children: ITree[] | undefined) {
    if (children) {
      node.children = children;
    }
    node.loading = false;
  }
}
