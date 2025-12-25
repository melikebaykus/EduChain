import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, VerifyStatus } from '../../services/api.service';

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
        <h2 style="margin: 0 0 6px 0;">İşveren Paneli</h2>
        <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
          Sertifika hash değeri ile diploma doğruluğunu doğrulayın
        </p>

        <label style="font-weight: 600; font-size: 14px;">
          Sertifika Hash
        </label>

        <input
          type="text"
          [(ngModel)]="hash"
          placeholder="örn. 0xA1B2C3..."
          style="
            width: 100%;
            padding: 10px;
            margin-top: 6px;
            margin-bottom: 14px;
            border-radius: 8px;
            border: 1px solid #ccc;
            outline-color: #5b5be0;
          "
        />

        <button
          (click)="verify()"
          [disabled]="loading"
          style="
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            border: none;
            background: #5b5be0;
            color: white;
            font-weight: 600;
            cursor: pointer;
          "
        >
          {{ loading ? 'Doğrulanıyor...' : 'Sertifikayı Doğrula' }}
        </button>

        <div
          *ngIf="!loading && status"
          style="
            margin-top: 18px;
            display: flex;
            justify-content: center;
          "
        >
          <div
            [ngStyle]="{
              'background':
                status === 'VALID'
                  ? '#e7f7ee'
                  : status === 'REVOKED'
                  ? '#fff4e5'
                  : '#fdecea',
              'color':
                status === 'VALID'
                  ? '#1e8e3e'
                  : status === 'REVOKED'
                  ? '#b26a00'
                  : '#c5221f'
            }"
            style="
              padding: 8px 16px;
              border-radius: 999px;
              font-weight: 600;
              font-size: 14px;
            "
          >
            <span *ngIf="status === 'VALID'">✅ Sertifika GEÇERLİ</span>
            <span *ngIf="status === 'INVALID'">❌ Sertifika GEÇERSİZ</span>
            <span *ngIf="status === 'REVOKED'">⚠️ Sertifika İPTAL EDİLMİŞ</span>
          </div>
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
}
