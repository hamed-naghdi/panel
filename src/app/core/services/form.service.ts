import { Injectable } from '@angular/core';
import {FormGroup} from '@angular/forms';
import IErrorDescriber from '../models/errorDescriber';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  public getControl (key: string, form: FormGroup){
    // TODO: update it later for more advance including dynamic forms
    return form.get(key);
  }

  public getServerFormErrors(key: string, form: FormGroup): string[] {
    const errors = form.get(key)?.errors as IErrorDescriber[];
    if (!errors || errors.length === 0)
      return [];

    return errors.map(e => e.description);
  }
}
