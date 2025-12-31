import { Routes } from '@angular/router';

import { LoginPage } from './pages/auth/login.page';
import { EmployerDashboardPage } from './pages/employer/employer-dashboard.page';
import { NotFoundPage } from './pages/not-found.page';

import { roleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [

  // 🔹 İlk açılış
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // 🔹 Login
  { path: 'login', component: LoginPage },

  // ✅ EMPLOYER → LAYOUT YOK (sidebar YOK)
  {
    path: 'employer',
    component: EmployerDashboardPage,
    canActivate: [roleGuard(['EMPLOYER'])]
  },

  // 🔹 Diğer roller için layout (şimdilik kapalı)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ileride açılacak
      // { path: 'admin', component: AdminDashboardPage },
      // { path: 'university', component: UniversityDashboardPage },
      // { path: 'graduate', component: GraduateDashboardPage },
    ]
  },

  // 🔹 404
  { path: '**', component: NotFoundPage }
];
