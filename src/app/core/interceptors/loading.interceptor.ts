import {HttpContextToken, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';

import {LoadingService} from '../services/loading.service';
import {finalize} from 'rxjs/operators';

export const SkipLoading = new HttpContextToken<boolean>(() => false)

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  loadingService.loadingOn();
  return next(req).pipe(
    // delay(2000),
    finalize(() => {
      loadingService.loadingOff();
    })
  );
};
