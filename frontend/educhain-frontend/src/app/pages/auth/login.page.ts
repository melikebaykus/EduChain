import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">

        <h1>EduChain</h1>
        <p class="subtitle">Güvenli Diploma Doğrulama Platformu</p>

        <!-- 🔹 1. ADIM: SEÇİM -->
        <ng-container *ngIf="mode === 'choice'">
          <button class="primary" (click)="mode = 'login'">Giriş Yap</button>
          <button class="secondary" (click)="mode = 'register'">Kayıt Ol</button>
        </ng-container>

        <!-- 🔹 2. ADIM: GİRİŞ -->
        <ng-container *ngIf="mode === 'login'">
          <input [(ngModel)]="email" placeholder="E-posta" />
          <input [(ngModel)]="password" type="password" placeholder="Şifre" />

          <button class="primary" (click)="login()">Giriş Yap</button>

          <a (click)="mode = 'choice'">← Geri</a>
        </ng-container>

        <!-- 🔹 3. ADIM: KAYIT (ŞİMDİLİK DEMO) -->
        <ng-container *ngIf="mode === 'register'">
          <p>🚧 Kayıt ekranı yakında</p>
          <a (click)="mode = 'choice'">← Geri</a>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f6f7fb;
    }

    .card {
      width: 360px;
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      text-align: center;
    }

    h1 {
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 24px;
    }

    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 12px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }

    button {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 10px;
    }

    .primary {
      background: #5b5be0;
      color: white;
    }

    .secondary {
      background: #e0e0ff;
      color: #333;
    }

    a {
      font-size: 13px;
      color: #5b5be0;
      cursor: pointer;
    }
  `]
})
export class LoginPage {
  mode: 'choice' | 'login' | 'register' = 'choice';

  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // 🔐 DEMO LOGIN
    localStorage.setItem('role', 'EMPLOYER');
    this.router.navigate(['/employer']);
  }
}
