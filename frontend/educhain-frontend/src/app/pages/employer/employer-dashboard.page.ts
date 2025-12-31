import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService, VerifyStatus } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

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

        <!-- HEADER -->
        <div class="card-head">
          <div class="icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
                stroke="currentColor"
                stroke-width="1.6"
              />
            </svg>
          </div>
          <h2>Sertifika Doğrulama</h2>
        </div>

        <!-- INPUT -->
        <label>Sertifika Hash</label>

        <div class="input-wrap">
          <span class="prefix">0x</span>

          <input
            type="text"
            [(ngModel)]="hash"
            placeholder="A1B2C3..."
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
          İpucu: Hash genelde <b>0x</b> ile başlar.
        </div>

        <!-- BUTTON -->
        <button
          class="verify-btn"
          (click)="verify()"
          [disabled]="loading || !hash"
        >
          {{ loading ? 'Sorgulanıyor...' : 'Hash Doğrula' }}
        </button>

        <!-- RESULT -->
        <div *ngIf="!loading && status" class="result">

          <div class="badge valid" *ngIf="status === 'VALID'">
            ✅ Sertifika GEÇERLİ
          </div>

          <div class="badge revoked" *ngIf="status === 'REVOKED'">
            ⚠️ Sertifika İPTAL EDİLMİŞ
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
      font-family:'Outfit','Inter',system-ui,sans-serif;
    }

    /* PAGE */
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

    /* BACKGROUND AMBIENT */
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
      pointer-events:none;
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

    /* LOGOUT */
    .logout-btn{
      position:absolute;
      top:24px;
      right:28px;
      padding:8px 16px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.25);
      background:rgba(255,255,255,.12);
      color:white;
      cursor:pointer;
      backdrop-filter:blur(10px);
      z-index:2;
    }

    /* TITLE */
    .top-title{
      position:absolute;
      top:48px;
      width:100%;
      text-align:center;
      z-index:2;
    }

    .top-title h1{
      font-size:42px;
      font-weight:700;
      letter-spacing:.3px;
    }

    /* CARD */
    .glass-card{
      width:520px;
      padding:38px;
      border-radius:36px;
      background: linear-gradient(
        160deg,
        rgba(255,255,255,0.28),
        rgba(255,255,255,0.10)
      );
      backdrop-filter: blur(36px) saturate(120%);
      border:1px solid rgba(255,255,255,0.28);
      box-shadow:
        inset 0 1px 1px rgba(255,255,255,.35),
        0 40px 100px rgba(0,0,0,.65);
      margin-top:40px;
      z-index:2;
    }

    .card-head{
      display:flex;
      align-items:center;
      gap:14px;
      margin-bottom:26px;
    }

    .icon{
      width:44px;
      height:44px;
      border-radius:16px;
      background:rgba(255,255,255,.18);
      display:flex;
      align-items:center;
      justify-content:center;
    }

    label{
      display:block;
      font-size:14px;
      color:#cbd5f5;
      margin-bottom:8px;
    }

    .input-wrap{
      display:flex;
      align-items:center;
      gap:10px;
      padding:12px;
      border-radius:18px;
      background:rgba(255,255,255,.30);
      border:1px solid rgba(255,255,255,.22);
    }

    .prefix{
      padding:6px 10px;
      border-radius:999px;
      background:rgba(255,255,255,.18);
      font-size:13px;
    }

    input{
      flex:1;
      border:none;
      background:transparent;
      color:white;
      font-size:14px;
      outline:none;
    }

    .mini-btn{
      padding:8px 14px;
      border-radius:14px;
      border:none;
      background:rgba(255,255,255,.25);
      color:white;
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
      padding:16px;
      border-radius:18px;
      border:none;
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.38),
        rgba(255,255,255,0.22)
      );
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
      border-radius:20px;
      font-weight:600;
    }

    .badge.valid{
      background:rgba(34,197,94,.15);
      color:#22c55e;
    }

    .badge.revoked{
      background:rgba(234,179,8,.15);
      color:#eab308;
    }

    .badge.invalid{
      background:rgba(239,68,68,.15);
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

    const finalHash = this.hash.startsWith('0x')
      ? this.hash
      : `0x${this.hash}`;

    this.api.verifyCertificate(finalHash).subscribe({
      next: (res) => {
        this.status = res.status;
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
