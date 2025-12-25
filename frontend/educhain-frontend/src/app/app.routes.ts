import { Routes } from '@angular/router';

import { LoginPage } from './pages/auth/login.page';
import { AdminDashboardPage } from './pages/admin/admin-dashboard.page';
import { UniversityDashboardPage } from './pages/university/university-dashboard.page';
import { GraduateDashboardPage } from './pages/graduate/graduate-dashboard.page';
import { EmployerDashboardPage } from './pages/employer/employer-dashboard.page';
import { NotFoundPage } from './pages/not-found.page';

import { roleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: LoginPage },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin',
        component: AdminDashboardPage,
        canActivate: [roleGuard(['ADMIN'])]
      },
      {
        path: 'university',
        component: UniversityDashboardPage,
        canActivate: [roleGuard(['UNIVERSITY'])]
      },
      {
        path: 'graduate',
        component: GraduateDashboardPage,
        canActivate: [roleGuard(['GRADUATE'])]
      },
      {
        path: 'employer',
        component: EmployerDashboardPage,
        canActivate: [roleGuard(['EMPLOYER'])]
      }
    ]
  },

  { path: '**', component: NotFoundPage }
];
