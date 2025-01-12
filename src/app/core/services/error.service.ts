import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {MessageService} from 'primeng/api';

import {IApiResult, IServerSideError} from '../models/apiResult';
import {isApiResult} from '../utilities/apiTypeGuard';
import {FormGroup} from '@angular/forms';
import IErrorDescriber from '../models/errorDescriber';
import {FormService} from './form.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private readonly messageService: MessageService,
              private readonly formService: FormService,) { }

  public catchHttpError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  public translateServerErrors(serverKey: string, translates?: [{serverKey: string, formKey: string}]): string {
    let frontKey: string = serverKey;
    const translatedKey = translates?.find((x) => x.serverKey === serverKey);
    if (translatedKey) {
      frontKey = translatedKey.formKey;
    }
    return frontKey;
  }

  public setServerErrors(form: FormGroup, error: HttpErrorResponse, translates?: [{serverKey: string, formKey: string}]) {
    if (error.error instanceof ErrorEvent || !isApiResult(error.error))
      return;

    const serverError = error.error as IApiResult<any>;
    const apiErrors: IServerSideError | undefined = serverError.errors;
    if (!apiErrors)
      return;

    for (let key in apiErrors) {
      const errorDescribers: IErrorDescriber[] = apiErrors[key]
      const formKey: string = this.translateServerErrors(key, translates);
      const control = this.formService.getControl(formKey, form);
      control?.setErrors(errorDescribers);
    }
  }

  public notifyErrors(error: HttpErrorResponse): void {
    const messages = []

    if (error.error instanceof ErrorEvent) {
      // client-side or network error
      messages.push({ severity: 'error', summary: 'Unknown Error occurred' })
    } else {
      // server-side error
      if (!isApiResult(error.error)) {
        messages.push({ severity: 'error', summary: 'Unknown Error occurred', detail: `try again later` });
      } else {
        const serverError = error.error as IApiResult<any>;
        if (serverError.message)
          messages.push({ severity: 'error', summary: serverError.message })
      }
    }

    this.messageService.addAll(messages);
  }
}
