import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../types/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

  loginAs(role: UserRole, wallet?: string) {
    localStorage.setItem('role', role);

    if (role === 'GRADUATE') {
      localStorage.setItem('wallet', (wallet ?? '').trim());
    } else {
      localStorage.removeItem('wallet');
    }
  }

  getWallet(): string | null {
    return localStorage.getItem('wallet');
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('wallet');
  }

  registerGraduate(data: {
    fullName: string;
    username: string;
    email: string;
    universityName: string;
    department: string;
    studentNumber: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register/graduate`, data);
  }
}
