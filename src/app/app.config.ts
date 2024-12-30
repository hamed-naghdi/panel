import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {providePrimeNG} from 'primeng/config';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import {apiInterceptor} from './core/interceptors/api.interceptor';
import {primeNgConfig} from './primeNgConfig';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    MessageService,
    provideHttpClient(withInterceptors([
      apiInterceptor
    ])),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: primeNgConfig,
        options: {
          darkModeSelector: false
        }
      }
    })
  ]
};
