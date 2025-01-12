export interface IUploadRequest {
  files: File[];
  directory: string;
}

export interface IUploadResponse {
  id: number;
  filePath: string;
  success: boolean;
}
