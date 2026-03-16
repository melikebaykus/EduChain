import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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

      <div class="bg">
        <span class="ambient"></span>
        <span class="vignette"></span>
      </div>

      <button class="logout-btn" (click)="logout()">Çıkış Yap</button>

      <div class="top-title">
        <h1>Diploma ve Sertifika Doğrulama İşlemi</h1>
      </div>

      <div class="glass-card">

        <div class="card-head">
          <div class="icon">🔒</div>
          <h2>Sertifika Doğrulama</h2>
        </div>

        <label>Diploma / Sertifika PDF</label>

        <div class="input-wrap">
          <input
            type="file"
            accept="application/pdf"
            (change)="onFileSelected($event)"
          />
        </div>

        <div class="hint">
          İpucu: Doğrulamak istediğiniz PDF dosyasını seçiniz.
        </div>

        <label style="margin-top:16px;">Üniversite</label>

        <div class="input-wrap">
          <select [(ngModel)]="universityName" (change)="onUniversityChange()">
            <option value="">Üniversite seçiniz</option>
            <option *ngFor="let university of universities" [value]="university">
              {{ university }}
            </option>
          </select>
        </div>

        <div class="hint">
          İpucu: Mezunun kayıtlı olduğu üniversiteyi seçiniz.
        </div>

        <label style="margin-top:16px;">Bölüm</label>

        <div class="input-wrap">
          <select [(ngModel)]="department" [disabled]="departmentsLoading || !universityName">
            <option value="">Bölüm seçiniz</option>
            <option *ngFor="let dept of departments" [value]="dept">
              {{ dept }}
            </option>
          </select>
        </div>

        <div class="hint">
          İpucu: Seçilen üniversiteye ait bölümü seçiniz.
        </div>

        <label style="margin-top:16px;">Öğrenci Numarası</label>

        <div class="input-wrap">
          <input
            type="text"
            [(ngModel)]="studentNumber"
            placeholder="Örn: 220303014"
          />
        </div>

        <div class="hint">
          İpucu: Doğrulama işlemi, üniversite, bölüm ve öğrenci numarasına ait kayıt üzerinden yapılır.
        </div>

        <button
          class="verify-btn"
          (click)="verify()"
          [disabled]="loading || !selectedFile || !universityName || !department || !studentNumber"
        >
          {{ loading ? 'Doğrulanıyor...' : 'Doğrula' }}
        </button>

        <div *ngIf="status && !loading" class="result">
          <div class="badge valid" *ngIf="status === 'VALID'">
            ✅ Sertifika GEÇERLİ
            <small>{{ resultMessage }}</small>
          </div>

          <div class="badge invalid" *ngIf="status === 'INVALID'">
            ❌ Sertifika GEÇERSİZ
            <small>{{ resultMessage }}</small>
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

    .card-head{
      display:flex;
      align-items:center;
      gap:6px;
      margin-bottom:26px;
    }

    .icon{
      font-size:22px;
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

    input, select{
      flex:1;
      border:none;
      background:transparent;
      color:white;
      outline:none;
      font-size:14px;
    }

    select option{
      color:black;
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

    .verify-btn:disabled{
      opacity:0.65;
      cursor:not-allowed;
    }

    .result{
      margin-top:22px;
      text-align:center;
    }

    .badge{
      padding:14px;
      border-radius:16px;
      font-weight:600;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .badge.valid{
      background:rgba(34,197,94,0.2);
      color:#22c55e;
    }

    .badge.invalid{
      background:rgba(239,68,68,0.2);
      color:#ef4444;
    }

    .badge small{
      font-size:13px;
      font-weight:500;
      color:#e5e7eb;
    }
  `]
})
export class EmployerDashboardPage implements OnInit {

  selectedFile: File | null = null;

  universityName = '';
  department = '';
  studentNumber = '';

  universities: string[] = [];
  departments: string[] = [];

  loading = false;
  departmentsLoading = false;
  status: VerifyStatus | null = null;
  resultMessage = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.api.getUniversities().subscribe({
      next: (res: string[]) => {
        this.universities = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.universities = [];
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = (input.files && input.files.length > 0) ? input.files[0] : null;
    this.cdr.detectChanges();
  }

  onUniversityChange(): void {
    this.department = '';
    this.departments = [];

    if (!this.universityName) {
      this.cdr.detectChanges();
      return;
    }

    this.departmentsLoading = true;

    this.api.getDepartmentsByUniversity(this.universityName).subscribe({
      next: (res: string[]) => {
        this.departments = res;
        this.departmentsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.departments = [];
        this.departmentsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verify(): void {
    if (!this.selectedFile || !this.universityName || !this.department || !this.studentNumber) return;

    this.loading = true;
    this.status = null;
    this.resultMessage = '';

    this.api.verifyCertificatePdf(
      this.selectedFile,
      this.universityName,
      this.department,
      this.studentNumber
    ).subscribe({
      next: (res: { status: string }) => {
        this.resultMessage = res.status;

        if (res.status && res.status.toUpperCase().includes('GEÇERLİ')) {
          this.status = 'VALID';
        } else {
          this.status = 'INVALID';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.status = 'INVALID';
        this.resultMessage = err?.error?.status || 'Doğrulama sırasında hata oluştu.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
