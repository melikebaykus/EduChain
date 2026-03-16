import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

type LoginMode = 'CHOOSE' | 'GRADUATE' | 'EMPLOYER';
type AuthView = 'LOGIN' | 'REGISTER';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">

      <div class="top-title">
        <h1>Sertifika Doğrulama Platformu</h1>
      </div>

      <div class="diploma">
        <div class="orb orb-top-left"></div>
        <div class="orb orb-top-right"></div>
        <div class="orb orb-bottom-center"></div>

        <div class="eyes" [class.focused]="passwordFocused">
          <span class="eye"></span>
          <span class="eye"></span>
        </div>

        <div class="card">

          <ng-container *ngIf="mode === 'CHOOSE'">
            <h2>Giriş Seç</h2>

            <button (click)="chooseGraduate()">Mezun Girişi</button>
            <button class="secondary" (click)="chooseEmployer()">İşveren Girişi</button>

            <div class="links single">
              <span>Şifremi unuttum</span>
            </div>
          </ng-container>

          <ng-container *ngIf="mode !== 'CHOOSE'">
            <div class="back-row">
              <button class="back-btn" (click)="back()">← Geri</button>
              <div class="mode-pill">
                {{ mode === 'GRADUATE' ? 'Mezun' : 'İşveren' }}
              </div>
            </div>

            <div class="tab-row">
              <button
                class="tab-btn"
                [class.active]="view === 'LOGIN'"
                (click)="view = 'LOGIN'">
                Giriş Yap
              </button>

              <button
                class="tab-btn"
                [class.active]="view === 'REGISTER'"
                (click)="view = 'REGISTER'">
                Kayıt Ol
              </button>
            </div>

            <ng-container *ngIf="view === 'LOGIN'">
              <h2>Giriş</h2>

              <label>
                {{ mode === 'GRADUATE'
                    ? 'E-posta veya Kullanıcı Adı'
                    : 'Kurumsal E-posta' }}
              </label>
              <input
                [(ngModel)]="loginIdentifier"
                [placeholder]="mode === 'GRADUATE' ? 'mail veya kullanıcı adı' : 'kurum maili'"
                (focus)="passwordFocused = false"
              />

              <label>Şifre</label>
              <input
                type="password"
                [(ngModel)]="password"
                placeholder="Şifrenizi girin"
                (focus)="passwordFocused = true"
              />

              <button (click)="login()" [disabled]="loading">
                {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
              </button>

              <div class="links">
                <span>Şifremi unuttum</span>
                <span (click)="view='REGISTER'" class="link-btn">Kayıt Ol</span>
              </div>
            </ng-container>

            <ng-container *ngIf="view === 'REGISTER'">

              <ng-container *ngIf="mode === 'GRADUATE'">
                <h2>Mezun Kayıt</h2>

                <label>Ad Soyad</label>
                <input [(ngModel)]="graduateFullName" placeholder="Ad Soyad" />

                <label>Kullanıcı Adı</label>
                <input [(ngModel)]="graduateUsername" placeholder="benzersiz kullanıcı adı" />

                <label>E-posta</label>
                <input [(ngModel)]="graduateEmail" placeholder="ornek@mail.com" />

                <label>Üniversite</label>
                <input [(ngModel)]="graduateUniversity" placeholder="Üniversite adı" />

                <label>Bölüm</label>
                <input [(ngModel)]="graduateDepartment" placeholder="Bölüm adı" />

                <label>Okul Numarası</label>
                <input [(ngModel)]="graduateSchoolNumber" placeholder="Örn: 220303014" />

                <label>Şifre</label>
                <input
                  type="password"
                  [(ngModel)]="graduateRegisterPassword"
                  placeholder="Şifre oluştur"
                  (focus)="passwordFocused = true"
                />

                <label>Şifre Tekrar</label>
                <input
                  type="password"
                  [(ngModel)]="graduateRegisterPasswordAgain"
                  placeholder="Şifreyi tekrar gir"
                  (focus)="passwordFocused = true"
                />

                <button (click)="registerGraduate()" [disabled]="loading">
                  {{ loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol' }}
                </button>
              </ng-container>

              <ng-container *ngIf="mode === 'EMPLOYER'">
                <h2>İşveren Kayıt</h2>

                <label>Kurum Adı</label>
                <input [(ngModel)]="employerInstitutionName" placeholder="Kurum adı" />

                <label>Kurumsal E-posta</label>
                <input [(ngModel)]="employerEmail" placeholder="info@kurum.com" />

                <label>Şifre</label>
                <input
                  type="password"
                  [(ngModel)]="employerRegisterPassword"
                  placeholder="Şifre oluştur"
                  (focus)="passwordFocused = true"
                />

                <label>Şifre Tekrar</label>
                <input
                  type="password"
                  [(ngModel)]="employerRegisterPasswordAgain"
                  placeholder="Şifreyi tekrar gir"
                  (focus)="passwordFocused = true"
                />

                <button (click)="registerEmployer()" [disabled]="loading">
                  {{ loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol' }}
                </button>
              </ng-container>

              <div class="links single">
                <span (click)="view='LOGIN'" class="link-btn">Zaten hesabım var</span>
              </div>
            </ng-container>

            <p *ngIf="message" class="message">{{ message }}</p>
          </ng-container>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

    * {
      box-sizing: border-box;
      font-family: 'Outfit', 'Inter', system-ui, sans-serif;
    }

    .page {
      min-height: 100vh;
      background: #05070c;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: relative;
      padding: 24px;
    }

    .top-title {
      position: absolute;
      top: 30px;
      width: 100%;
      text-align: center;
      z-index: 3;
    }

    .top-title h1 {
      font-size: 56px;
      font-weight: 600;
      letter-spacing: -1px;
      color: #ffffff;
      text-shadow:
        0 0 40px rgba(96, 165, 250, 0.4),
        0 0 20px rgba(147, 197, 253, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.3);
      font-family: 'Outfit', sans-serif;
    }

    .diploma {
      position: relative;
      z-index: 2;
      margin-top: 80px;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      z-index: 1;
      background: radial-gradient(
        circle at 35% 35%,
        rgba(100, 110, 125, 0.9) 0%,
        rgba(65, 75, 85, 0.85) 35%,
        rgba(45, 52, 60, 0.9) 65%,
        rgba(30, 35, 42, 0.95) 100%
      );
      opacity: 0.95;
      box-shadow:
        inset -15px -15px 40px rgba(0, 0, 0, 0.5),
        inset 15px 15px 40px rgba(120, 130, 145, 0.15),
        0 25px 60px rgba(0, 0, 0, 0.8);
    }

    .orb-top-left { width:200px;height:200px;top:80px;left:-60px; }
    .orb-top-right { width:240px;height:240px;top:20px;right:-80px; }
    .orb-bottom-center { width:180px;height:180px;bottom:-40px;left:50%;transform:translateX(-50%); }

    .eyes {
      position: absolute;
      top: -16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 18px;
      padding: 10px 30px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 0 0 24px 24px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.6);
      z-index: 4;
    }

    .eye {
      width:16px;
      height:16px;
      background:#f8fafc;
      border-radius:50%;
      position:relative;
    }

    .eye::after {
      content:'';
      width:6px;
      height:6px;
      background:#020617;
      border-radius:50%;
      position:absolute;
      top:5px;
      left:5px;
    }

    .eyes.focused .eye {
      height:6px;
      border-radius:6px;
    }

    .eyes.focused .eye::after {
      opacity:0;
    }

    .card {
      width: 460px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 46px 42px;
      border-radius: 36px;
      background: linear-gradient(
        145deg,
        rgba(255,255,255,0.18),
        rgba(255,255,255,0.06)
      );
      backdrop-filter: blur(26px);
      border: 1px solid rgba(255,255,255,0.22);
      box-shadow:
        inset 0 1px 1px rgba(255,255,255,0.3),
        0 40px 90px rgba(0,0,0,0.75);
      text-align: center;
      z-index: 2;
      position: relative;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 28px;
      font-weight: 700;
    }

    label {
      display: block;
      text-align: left;
      font-size: 13px;
      color: #cbd5f5;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 14px 16px;
      border-radius: 16px;
      border: none;
      background: rgba(255,255,255,0.25);
      color: white;
      font-size: 14px;
    }

    input::placeholder {
      color: rgba(255,255,255,0.45);
    }

    input:focus {
      outline: none;
      background: rgba(255,255,255,0.3);
    }

    button {
      width: 100%;
      margin-top: 16px;
      padding: 16px;
      border-radius: 18px;
      border: none;
      background: rgba(255,255,255,0.28);
      color: white;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    button.secondary {
      background: rgba(255,255,255,0.18);
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 22px;
      font-size: 13px;
      color: #cbd5f5;
    }

    .links.single {
      justify-content: center;
    }

    .back-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      gap: 10px;
    }

    .back-btn {
      width: auto;
      margin-top: 0;
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.14);
      font-size: 13px;
    }

    .mode-pill {
      font-size: 12px;
      color: #cbd5f5;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.08);
    }

    .tab-row {
      display: flex;
      gap: 10px;
      margin: 16px 0 24px;
    }

    .tab-btn {
      flex: 1;
      margin-top: 0;
      padding: 12px;
      border-radius: 14px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.15);
      font-size: 14px;
    }

    .tab-btn.active {
      background: rgba(255,255,255,0.28);
    }

    .link-btn {
      cursor: pointer;
    }

    .message {
      margin-top: 16px;
      font-size: 13px;
      color: #cbd5f5;
    }

    @media (max-width: 768px) {
      .top-title h1 {
        font-size: 34px;
        padding: 0 16px;
      }

      .card {
        width: min(100%, 420px);
        padding: 34px 22px;
      }
    }
  `]
})
export class LoginPage {
  mode: LoginMode = 'CHOOSE';
  view: AuthView = 'LOGIN';

  loading = false;

  loginIdentifier = '';
  password = '';

  graduateFullName = '';
  graduateUsername = '';
  graduateEmail = '';
  graduateUniversity = '';
  graduateDepartment = '';
  graduateSchoolNumber = '';
  graduateRegisterPassword = '';
  graduateRegisterPasswordAgain = '';

  employerInstitutionName = '';
  employerEmail = '';
  employerRegisterPassword = '';
  employerRegisterPasswordAgain = '';

  passwordFocused = false;
  message = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  chooseGraduate() {
    this.mode = 'GRADUATE';
    this.view = 'LOGIN';
    this.clearMessage();
  }

  chooseEmployer() {
    this.mode = 'EMPLOYER';
    this.view = 'LOGIN';
    this.clearMessage();
  }

  back() {
    this.mode = 'CHOOSE';
    this.view = 'LOGIN';
    this.passwordFocused = false;
    this.loading = false;
    this.clearAllFields();
    this.clearMessage();
  }

  login() {
    if (!this.loginIdentifier || !this.password) {
      this.message = 'Lütfen giriş bilgilerinizi doldurun.';
      return;
    }

    if (this.mode === 'GRADUATE') {
      this.authService.loginAs('GRADUATE');
      this.router.navigate(['/graduate']);
      return;
    }

    this.authService.loginAs('EMPLOYER');
    this.router.navigate(['/employer']);
  }

  registerGraduate() {
    if (
      !this.graduateFullName ||
      !this.graduateUsername ||
      !this.graduateEmail ||
      !this.graduateUniversity ||
      !this.graduateDepartment ||
      !this.graduateSchoolNumber ||
      !this.graduateRegisterPassword ||
      !this.graduateRegisterPasswordAgain
    ) {
      this.message = 'Lütfen tüm mezun kayıt alanlarını doldurun.';
      return;
    }

    if (this.graduateRegisterPassword !== this.graduateRegisterPasswordAgain) {
      this.message = 'Şifreler eşleşmiyor.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.registerGraduate({
      fullName: this.graduateFullName,
      username: this.graduateUsername,
      email: this.graduateEmail,
      universityName: this.graduateUniversity,
      department: this.graduateDepartment,
      studentNumber: this.graduateSchoolNumber,
      password: this.graduateRegisterPassword
    }).subscribe({
      next: (res: any) => {
        this.message = res?.message || 'Mezun kaydı başarıyla oluşturuldu.';
        this.view = 'LOGIN';
        this.loginIdentifier = this.graduateEmail;
        this.password = this.graduateRegisterPassword;
        this.loading = false;
      },
      error: (err: any) => {
        this.message = err?.error?.message || 'Mezun kaydı sırasında hata oluştu.';
        this.loading = false;
      }
    });
  }

  registerEmployer() {
    if (
      !this.employerInstitutionName ||
      !this.employerEmail ||
      !this.employerRegisterPassword ||
      !this.employerRegisterPasswordAgain
    ) {
      this.message = 'Lütfen tüm kurum kayıt alanlarını doldurun.';
      return;
    }

    if (this.employerRegisterPassword !== this.employerRegisterPasswordAgain) {
      this.message = 'Şifreler eşleşmiyor.';
      return;
    }

    this.message = 'Kurum kaydı hazır. Gerçek kayıt için backend endpoint bağlanacak.';
    this.view = 'LOGIN';
    this.loginIdentifier = this.employerEmail;
    this.password = this.employerRegisterPassword;
  }

  clearAllFields() {
    this.loginIdentifier = '';
    this.password = '';

    this.graduateFullName = '';
    this.graduateUsername = '';
    this.graduateEmail = '';
    this.graduateUniversity = '';
    this.graduateDepartment = '';
    this.graduateSchoolNumber = '';
    this.graduateRegisterPassword = '';
    this.graduateRegisterPasswordAgain = '';

    this.employerInstitutionName = '';
    this.employerEmail = '';
    this.employerRegisterPassword = '';
    this.employerRegisterPasswordAgain = '';
  }

  clearMessage() {
    this.message = '';
  }
}
