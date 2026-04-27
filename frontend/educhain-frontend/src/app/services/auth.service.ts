import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { UserRole } from '../types/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ─── OTURUM ─────────────────────────────────────────────────────────────────

  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

  saveSession(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  loginAs(role: UserRole, wallet?: string): void {
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('wallet');
    localStorage.removeItem('token');
  }

  // ─── AUTH HEADER ─────────────────────────────────────────────────────────────
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ─── AUTH API ÇAĞRILARI ──────────────────────────────────────────────────────

  login(identifier: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, { identifier, password });
  }

  // ✅ YENİ: FormData ile mezun kaydı (diploma PDF desteği)
  registerGraduate(data: {
    fullName: string;
    username: string;
    email: string;
    universityName: string;
    department: string;
    studentNumber: string;
    password: string;
    diplomaFile?: File | null;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('universityName', data.universityName);
    formData.append('department', data.department);
    formData.append('studentNumber', data.studentNumber);
    formData.append('password', data.password);

    // ✅ Diploma PDF varsa ekle
    if (data.diplomaFile) {
      formData.append('diplomaFile', data.diplomaFile);
    }

    // ✅ 120 saniye timeout — blockchain sorgusu uzun sürebilir
    return this.http.post(`${this.BASE_URL}/auth/register/graduate`, formData).pipe(
      timeout(120000)
    );
  }

  registerEmployer(data: {
    institutionName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register/employer`, data);
  }

  registerUniversity(data: {
    universityName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register/university`, data);
  }

  // ─── WALLET API ÇAĞRILARI ────────────────────────────────────────────────────

  getWalletChallenge(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/wallet/challenge`, {
      headers: this.getAuthHeaders()
    });
  }

  verifyWalletSignature(data: {
    walletAddress: string;
    message: string;
    signature: string;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/wallet/verify`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ─── PROFİL API ÇAĞRILARI ────────────────────────────────────────────────────

  getMe(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/user/me`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/user/profile`, data, {
      headers: this.getAuthHeaders()
    });
  }
}
