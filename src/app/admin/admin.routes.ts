import {Routes} from '@angular/router';
import {AdminComponent} from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'media',
        loadComponent: () => import('./media/media.component').then(m => m.MediaComponent),
      }
    ]
  },
]
