import { Routes } from '@angular/router';

import { LoginPage } from './pages/auth/login.page';
import { EmployerDashboardPage } from './pages/employer/employer-dashboard.page';
import { NotFoundPage } from './pages/not-found.page';

import { roleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  // 🔹 İlk açılış login
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // 🔹 Login her zaman açık
  { path: 'login', component: LoginPage },

  // 🔹 Ana layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ✅ SADECE EMPLOYER AKTİF
      {
        path: 'employer',
        component: EmployerDashboardPage,
        canActivate: [roleGuard(['EMPLOYER'])]
      }

      // ⛔ ŞİMDİLİK KAPALI (SİLME YOK)
      // {
      //   path: 'admin',
      //   component: AdminDashboardPage,
      //   canActivate: [roleGuard(['ADMIN'])]
      // },
      // {
      //   path: 'university',
      //   component: UniversityDashboardPage,
      //   canActivate: [roleGuard(['UNIVERSITY'])]
      // },
      // {
      //   path: 'graduate',
      //   component: GraduateDashboardPage,
      //   canActivate: [roleGuard(['GRADUATE'])]
      // }
    ]
  },

  // 🔹 Hatalı URL
  { path: '**', component: NotFoundPage }
];
