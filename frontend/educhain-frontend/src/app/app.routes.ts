import { Routes } from '@angular/router';

import { LoginPage } from './pages/auth/login.page';
import { EmployerHomePage } from './pages/employer/employer-home.page';
import { EmployerDashboardPage } from './pages/employer/employer-dashboard.page';
import { EmployerGraduatesPage } from './pages/employer/employer-graduates.page';
import { GraduateDashboardPage } from './pages/graduate/graduate-dashboard.page';
import { NotFoundPage } from './pages/not-found.page';

import { roleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: LoginPage },

  {
    path: 'employer',
    component: EmployerHomePage,
    canActivate: [roleGuard(['EMPLOYER'])]
  },

  {
    path: 'employer/dashboard',
    component: EmployerDashboardPage,
    canActivate: [roleGuard(['EMPLOYER'])]
  },

  {
    path: 'employer/graduates',
    component: EmployerGraduatesPage,
    canActivate: [roleGuard(['EMPLOYER'])]
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'graduate',
        component: GraduateDashboardPage,
        canActivate: [roleGuard(['GRADUATE'])]
      }
    ]
  },

  { path: '**', component: NotFoundPage }
];
