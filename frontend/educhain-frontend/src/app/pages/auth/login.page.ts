import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../types/role';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule],
  template: `
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #f7f9fc;
      "
    >
      <div
        style="
          width: 380px;
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          text-align: center;
        "
      >
        <h2 style="margin-bottom: 6px;">EduChain</h2>
        <p style="margin-bottom: 24px; color: #666; font-size: 14px;">
          Güvenli Diploma Doğrulama Platformu
        </p>

        <p style="font-weight: 600; margin-bottom: 12px;">
          Giriş Türü
        </p>

        <button
          *ngFor="let role of roles"
          (click)="login(role)"
          style="
            width: 100%;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 10px;
            border: none;
            background: #5b5be0;
            color: white;
            font-weight: 600;
            cursor: pointer;
          "
        >
          {{
            role === 'ADMIN' ? 'Yönetici' :
            role === 'UNIVERSITY' ? 'Üniversite' :
            role === 'GRADUATE' ? 'Mezun' :
            role === 'EMPLOYER' ? 'İşveren' :
            role
          }}
        </button>
      </div>
    </div>
  `
})
export class LoginPage {

  roles: UserRole[] = [
    'ADMIN',
    'UNIVERSITY',
    'GRADUATE',
    'EMPLOYER'
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(role: UserRole) {
    this.authService.loginAs(role);

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'UNIVERSITY':
        this.router.navigate(['/university']);
        break;
      case 'GRADUATE':
        this.router.navigate(['/graduate']);
        break;
      case 'EMPLOYER':
        this.router.navigate(['/employer']);
        break;
    }
  }
}
