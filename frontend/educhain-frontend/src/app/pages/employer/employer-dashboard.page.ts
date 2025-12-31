import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type VerifyStatus = 'VALID' | 'INVALID';

@Component({
  standalone: true,
  selector: 'app-employer-dashboard',
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="page">

      <!-- BACKGROUND -->
      <div class="bg">
        <span class="ambient"></span>
        <span class="vignette"></span>
      </div>

      <!-- LOGOUT -->
      <button class="logout-btn" (click)="logout()">Çıkış Yap</button>

      <!-- TITLE -->
      <div class="top-title">
        <h1>Diploma ve Sertifika Doğrulama İşlemi</h1>
      </div>

      <!-- CARD -->
      <div class="glass-card">

        <div class="card-head">
          <div class="icon">🔒</div>
          <h2>Sertifika Doğrulama</h2>
        </div>

        <label>Sertifika Hash</label>

        <div class="input-wrap">
          <input
            type="text"
            [(ngModel)]="hash"
            placeholder="Hash giriniz"
          />
          <button
            class="mini-btn"
            (click)="pasteFromClipboard()"
            [disabled]="loading"
          >
            Yapıştır
          </button>
        </div>

        <div class="hint">
          İpucu: Akıllı cüzdanınızda yer alan hash değerini giriniz.
        </div>

        <button
          class="verify-btn"
          (click)="verify()"
          [disabled]="loading || !hash"
        >
          {{ loading ? 'Sorgulanıyor...' : 'Hash Doğrula' }}
        </button>

        <div *ngIf="status && !loading" class="result">
          <div class="badge valid" *ngIf="status === 'VALID'">
            ✅ Sertifika GEÇERLİ
          </div>

          <div class="badge invalid" *ngIf="status === 'INVALID'">
            ❌ Sertifika GEÇERSİZ
            <small>Kayıt bulunamadı veya hatalı hash.</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    *{
      box-sizing:border-box;
      font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    }

    h1,h2{
      font-family:'Playfair Display','Outfit',serif;
    }

    .page{
      min-height:100vh;
      background: radial-gradient(
        circle at 50% 25%,
        #0c1426 0%,
        #070b14 45%,
        #05070c 100%
      );
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      position:relative;
      overflow:hidden;
    }

    .bg{
      position:absolute;
      inset:0;
      z-index:0;
    }

    .ambient{
      position:absolute;
      inset:-30%;
      background: radial-gradient(
        circle,
        rgba(255,255,255,0.18),
        rgba(255,255,255,0.04),
        transparent 60%
      );
      filter: blur(140px);
      opacity:0.35;
    }

    .vignette{
      position:absolute;
      inset:0;
      background: radial-gradient(
        ellipse at center,
        rgba(0,0,0,0) 35%,
        rgba(0,0,0,0.6) 75%,
        rgba(0,0,0,0.85) 100%
      );
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
      backdrop-filter:blur(10px);
      z-index:2;
    }

    .top-title{
      position:absolute;
      top:96px;
      width:100%;
      text-align:center;
      z-index:2;
    }

    .top-title h1{
      font-size:40px;
      font-weight:600;
      letter-spacing:0.6px;
      text-shadow:
        0 0 30px rgba(120,170,255,0.25),
        0 2px 6px rgba(0,0,0,0.4);
    }

    .glass-card{
      width:520px;
      padding:38px;
      border-radius:24px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.15);
      margin-top:60px;
      z-index:2;
    }

    /* 🔧 BURASI ÖNEMLİ */
    .card-head{
      display:flex;
      align-items:center;
      gap:6px;        /* ⬅️ boşluk küçültüldü */
      margin-bottom:26px;
    }

    .icon{
      font-size:22px;  /* ⬅️ ikon biraz küçültüldü */
      line-height:1;
    }

    label{
      display:block;
      font-size:14px;
      color:#cbd5f5;
      margin-bottom:8px;
    }

    .input-wrap{
      display:flex;
      gap:10px;
      padding:12px;
      border-radius:14px;
      background:rgba(255,255,255,0.15);
    }

    input{
      flex:1;
      border:none;
      background:transparent;
      color:white;
      outline:none;
    }

    .mini-btn{
      border:none;
      background:#444;
      color:white;
      border-radius:10px;
      padding:8px 12px;
      cursor:pointer;
    }

    .hint{
      margin-top:10px;
      font-size:12px;
      color:#cbd5f5;
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

    .result{
      margin-top:22px;
      text-align:center;
    }

    .badge{
      padding:14px;
      border-radius:16px;
      font-weight:600;
    }

    .badge.valid{
      background:rgba(34,197,94,0.2);
      color:#22c55e;
    }

    .badge.invalid{
      background:rgba(239,68,68,0.2);
      color:#ef4444;
    }
  `]
})
export class EmployerDashboardPage {

  hash = '';
  loading = false;
  status: VerifyStatus | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  verify(): void {
    if (!this.hash) return;

    this.loading = true;
    this.status = null;

    this.api.verifyCertificate(this.hash).subscribe({
      next: (res) => {
        this.status = res.status === 'GEÇERLİ' ? 'VALID' : 'INVALID';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.status = 'INVALID';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.hash = text.trim();
      this.cdr.detectChanges();
    } catch {}
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
