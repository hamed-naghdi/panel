export interface IUploadRequest {
  files: File[];
  directory: string;
}

interface IUploadedFileResponse {
  id: number;
  filePath: string;
  success: boolean;
}

export interface IUploadResponse {
  files: IUploadedFileResponse[];
}
