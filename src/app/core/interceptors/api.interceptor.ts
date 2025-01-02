import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;

  const modifiedReq = req.clone({
    url: `${apiUrl}/${req.url}`,
    setHeaders: {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  });

  return next(modifiedReq);
};
