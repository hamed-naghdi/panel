import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(message: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.log(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.error(message, ...optionalParams);
    }
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.debug(message, ...optionalParams);
    }
  }
}
