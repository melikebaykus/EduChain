import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

type VerifyStatus = 'VALID' | 'INVALID' | 'REVOKED';

@Component({
  standalone: true,
  selector: 'app-employer-dashboard',
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div
      style="
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        height: 100vh;
        padding-left: 180px;
        padding-top: 80px;
        background: #f7f9fc;
      "
    >
      <div
        style="
          width: 420px;
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          margin-left: 120px;
        "
      >
        <h2>İşveren Paneli</h2>
        <p style="color:#666;font-size:14px;">
          Sertifika hash değeri ile diploma doğruluğunu doğrulayın
        </p>

        <label style="font-weight:600;font-size:14px;">
          Sertifika Hash
        </label>

        <input
          type="text"
          [(ngModel)]="hash"
          placeholder="örn. bd455e2ca1c..."
          style="
            width:100%;
            padding:10px;
            margin-top:6px;
            margin-bottom:14px;
            border-radius:8px;
            border:1px solid #ccc;
          "
        />

        <button
          (click)="verify()"
          [disabled]="loading"
          style="
            width:100%;
            padding:12px;
            border-radius:10px;
            border:none;
            background:#5b5be0;
            color:white;
            font-weight:600;
          "
        >
          {{ loading ? 'Doğrulanıyor...' : 'Sertifikayı Doğrula' }}
        </button>

        <!-- ✅ SONUÇ -->
        <div *ngIf="status" style="margin-top:18px; text-align:center;">
          <span *ngIf="status === 'VALID'" style="color:#1e8e3e;font-weight:600;">
            ✅ Sertifika GEÇERLİ
          </span>

          <span *ngIf="status === 'INVALID'" style="color:#c5221f;font-weight:600;">
            ❌ Sertifika GEÇERSİZ
          </span>

          <span *ngIf="status === 'REVOKED'" style="color:#b26a00;font-weight:600;">
            ⚠️ Sertifika İPTAL EDİLMİŞ
          </span>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardPage {

  hash = '';
  loading = false;
  status: VerifyStatus | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  verify(): void {
    if (!this.hash) return;

    this.loading = true;
    this.status = null;

    this.api.verifyCertificate(this.hash).subscribe({
      next: (res: any) => {
        console.log('VERIFY RESPONSE:', res);

        const backendStatus =
          (res?.status ?? '')
            .toString()
            .toUpperCase()
            .trim();

        if (backendStatus.includes('GEÇER')) {
          this.status = 'VALID';
        } else if (backendStatus.includes('İPTAL')) {
          this.status = 'REVOKED';
        } else {
          this.status = 'INVALID';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('VERIFY ERROR:', err);
        this.status = 'INVALID';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
