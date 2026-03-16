import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-employer-graduates',
  imports: [CommonModule],
  template: `
    <div class="page">
      <button class="logout-btn" (click)="logout()">Çıkış Yap</button>

      <div class="top-title">
        <h1>Mezunlar</h1>
      </div>

      <div class="glass-card">
        <p>Şimdilik demo sayfası. Sonra mezun listesini backend’den çekeceğiz.</p>

        <button class="verify-btn" (click)="back()">Geri</button>
      </div>
    </div>
  `,
  styles: [`
    .page{
      min-height:100vh;
      background:#05070c;
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      position:relative;
    }
    .logout-btn{
      position:absolute;
      top:24px;
      right:28px;
      padding:8px 16px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,0.25);
      background:rgba(255,255,255,0.12);
      color:white;
      cursor:pointer;
    }
    .top-title{
      position:absolute;
      top:96px;
      width:100%;
      text-align:center;
    }
    .glass-card{
      width:520px;
      padding:38px;
      border-radius:24px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.15);
      margin-top:60px;
    }
    .verify-btn{
      margin-top:20px;
      width:100%;
      padding:14px;
      border:none;
      border-radius:14px;
      background:#555;
      color:white;
      font-weight:600;
      cursor:pointer;
    }
  `]
})
export class EmployerGraduatesPage {
  constructor(private router: Router, private auth: AuthService) {}

  back() { this.router.navigate(['/employer']); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
