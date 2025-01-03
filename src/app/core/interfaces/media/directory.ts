import {IFile} from './file';

export interface IDirectory {
  directoryPath: string;
  directories?: string[];
  files?: IFile[];
}
