import {Routes} from '@angular/router';
import {AdminComponent} from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    // data: { breadcrumb: 'Admin' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          breadcrumb: 'Dashboard',
          search: false,
        },
      },
      {
        path: 'media',
        loadComponent: () => import('./media/media.component').then(m => m.MediaComponent),
        data: {
          breadcrumb: 'Medien',
          search: true,
        },
      },
      {
        path: 'pages',
        loadComponent: () => import('./cms/pages/pages.component').then(m => m.PagesComponent),
        data: {
          breadcrumb: 'Seiten',
          search: true,
        },
      }
    ]
  },
]
