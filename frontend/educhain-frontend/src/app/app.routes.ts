import { Routes } from '@angular/router';

import { LoginPage } from './pages/auth/login.page';
import { EmployerHomePage } from './pages/employer/employer-home.page';
import { EmployerDashboardPage } from './pages/employer/employer-dashboard.page';
import { EmployerGraduatesPage } from './pages/employer/employer-graduates.page';
import { GraduateDashboardPage } from './pages/graduate/graduate-dashboard.page';
import { GraduateAuthPage } from './pages/graduate/graduate-auth.page';
import { UniversityDashboardPage } from './pages/university/university-dashboard.page';
import { UniversityVerifyPage } from './pages/university/university-verify.page';
import { NotFoundPage } from './pages/not-found.page';

import { roleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage },
  { path: 'employer', component: EmployerHomePage },
  { path: 'university-auth', component: UniversityDashboardPage },
  { path: 'graduate-auth', component: GraduateAuthPage },
  { path: 'employer/dashboard', component: EmployerDashboardPage, canActivate: [roleGuard(['EMPLOYER'])] },
  { path: 'employer/graduates', component: EmployerGraduatesPage, canActivate: [roleGuard(['EMPLOYER'])] },
  { path: 'university/dashboard', component: UniversityVerifyPage, canActivate: [roleGuard(['UNIVERSITY'])] },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'graduate', component: GraduateDashboardPage, canActivate: [roleGuard(['GRADUATE'])] }
    ]
  },
  { path: 'graduate-dashboard', redirectTo: 'graduate', pathMatch: 'full' },
  { path: 'employer-dashboard', redirectTo: 'employer/dashboard', pathMatch: 'full' },
  { path: 'university-dashboard', redirectTo: 'university-auth', pathMatch: 'full' },
  { path: '**', component: NotFoundPage }
];
