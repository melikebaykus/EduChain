import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-graduate-dashboard',
  imports: [CommonModule],
  template: `
    <div class="page">
      <button class="logout-btn" (click)="logout()">Çıkış Yap</button>

      <div class="top-title">
        <h1>Mezun Paneli</h1>
      </div>

      <div class="glass-card">
        <h2>Akıllı Cüzdan Profilim</h2>

        <label>Cüzdan Adresim</label>
        <div class="input-wrap">
          <input [value]="wallet" readonly />
          <button class="mini-btn" (click)="copy()">Kopyala</button>
        </div>
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
    label{display:block;color:#cbd5f5;margin:14px 0 8px;}
    .input-wrap{
      display:flex;gap:10px;padding:12px;border-radius:14px;background:rgba(255,255,255,0.15);
    }
    input{flex:1;border:none;background:transparent;color:white;outline:none;}
    .mini-btn{border:none;background:#444;color:white;border-radius:10px;padding:8px 12px;cursor:pointer;}
  `]
})
export class GraduateDashboardPage {
  wallet = '';

  constructor(private auth: AuthService, private router: Router) {
    this.wallet = this.auth.getWallet() ?? '';
  }

  async copy() {
    try { await navigator.clipboard.writeText(this.wallet); } catch {}
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
