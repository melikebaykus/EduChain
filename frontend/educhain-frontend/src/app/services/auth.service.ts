import { Injectable } from '@angular/core';
import { UserRole } from '../types/role';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Şimdilik localStorage kullanıyoruz
  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

  // DEMO için (login sayfasında kullanacağız)
  loginAs(role: UserRole) {
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.removeItem('role');
  }
}
