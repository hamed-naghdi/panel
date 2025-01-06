import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const isFileUpload = req.headers.has('File-Upload');
  const modifiedReq = req.clone({
    url: `${apiUrl}/${req.url}`,
    setHeaders: isFileUpload
      ? {} // Don't modify headers for file uploads
      : {
          'Content-Type': 'application/json; charset=UTF-8',
      },
  });

  if (isFileUpload) {
    // modifiedReq.headers.delete('File-Upload');
  }

  return next(modifiedReq);
};
