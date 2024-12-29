import {IFile} from './IFile';

export interface IDirectory {
  directoryPath: string;
  directories?: string[];
  files?: IFile;
}
