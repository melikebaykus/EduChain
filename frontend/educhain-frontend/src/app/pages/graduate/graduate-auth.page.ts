import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type AuthView = 'LOGIN' | 'REGISTER';

const EDEVLET_IMG = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAIAAgADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBQYCAwQJAf/9k=';

@Component({
  standalone: true,
  selector: 'app-graduate-auth',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <canvas id="bg-canvas-g"></canvas>
      <div class="grid-overlay"></div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <button class="back-btn" (click)="goBack()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Geri
      </button>

      <div class="lang-bar">
        <button class="lang-btn" [class.active]="lang === 'tr'" (click)="setLang('tr')">TR</button>
        <button class="lang-btn" [class.active]="lang === 'en'" (click)="setLang('en')">EN</button>
      </div>

      <div class="wrapper">
        <div class="card">

          <div class="card-header">
            <div class="emblem">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h1 class="card-title">{{ lang === 'tr' ? 'Mezun Portalı' : 'Graduate Portal' }}</h1>
            <p class="card-sub">{{ lang === 'tr' ? 'Kariyer yolculuğunuza hoş geldiniz' : 'Welcome to your career journey' }}</p>
          </div>

          <div class="tabs">
            <button class="tab" [class.active]="view === 'LOGIN'" (click)="view = 'LOGIN'">
              {{ lang === 'tr' ? 'Giriş Yap' : 'Sign In' }}
            </button>
            <button class="tab" [class.active]="view === 'REGISTER'" (click)="view = 'REGISTER'">
              {{ lang === 'tr' ? 'Kayıt Ol' : 'Register' }}
            </button>
          </div>

          <!-- LOGIN -->
          <ng-container *ngIf="view === 'LOGIN'">
            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'E-POSTA' : 'EMAIL' }}</label>
              <div class="fw">
                <input type="email" [(ngModel)]="loginEmail"
                       [placeholder]="lang === 'tr' ? 'ornek@mail.com' : 'example@mail.com'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ŞİFRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw1 ? 'text' : 'password'" [(ngModel)]="loginPassword"
                       [placeholder]="lang === 'tr' ? 'Şifrenizi giriniz' : 'Enter your password'" />
                <button class="eye-btn" (click)="showPw1 = !showPw1">
                  <svg *ngIf="!showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
            </div>

            <a class="forgot" href="#" (click)="$event.preventDefault()">
              {{ lang === 'tr' ? 'Şifremi unuttum' : 'Forgot password' }} &rarr;
            </a>

            <button class="action-btn" [disabled]="!loginEmail || !loginPassword" (click)="login()">
              {{ loginSuccess ? (lang === 'tr' ? 'Giriş Başarılı!' : 'Success!') : (lang === 'tr' ? 'GİRİŞ YAP' : 'SIGN IN') }}
            </button>

            <div class="divider"></div>

            <p class="edevlet-hint">
              <em>turkiye.gov.tr</em> {{ lang === 'tr' ? 'hesabınız ile de giriş yapabilirsiniz.' : 'You can also sign in with your account.' }}
            </p>
            <div class="social-row">
              <button class="social-btn" (click)="loginEdevlet()">
                <span class="edevlet-logo"><img [src]="edevletImg" alt="e-Devlet" /></span>
                {{ lang === 'tr' ? 'e-Devlet ile Giriş Yap' : 'Sign in with eGov' }}
              </button>
            </div>
          </ng-container>

          <!-- REGISTER -->
          <ng-container *ngIf="view === 'REGISTER'">

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'AD' : 'FIRST NAME' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="registerFirstName"
                         [placeholder]="lang === 'tr' ? 'Adınız' : 'First name'" />
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'SOYAD' : 'LAST NAME' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="registerLastName"
                         [placeholder]="lang === 'tr' ? 'Soyadınız' : 'Last name'" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'KULLANICI ADI' : 'USERNAME' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerUsername"
                       [placeholder]="lang === 'tr' ? '@kullanici_adi' : '@username'"
                       (input)="checkUsername(registerUsername)" />
                <span class="username-status" *ngIf="registerUsername.length > 2">
                  <svg *ngIf="usernameValid" viewBox="0 0 24 24" fill="none" stroke="#52c97a" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <svg *ngIf="!usernameValid" viewBox="0 0 24 24" fill="none" stroke="#e05252" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </span>
              </div>
              <p class="field-hint" *ngIf="!usernameValid && registerUsername.length > 2">
                {{ lang === 'tr' ? 'Sadece harf, rakam ve alt çizgi kullanın' : 'Only letters, numbers and underscores' }}
              </p>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'E-POSTA' : 'EMAIL' }}</label>
              <div class="fw">
                <input type="email" [(ngModel)]="registerEmail"
                       [placeholder]="lang === 'tr' ? 'ornek@mail.com' : 'example@mail.com'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ŞEHİR / İL' : 'CITY' }}</label>
              <div class="fw">
                <select [(ngModel)]="registerCity" (change)="onRegCityChange()">
                  <option value="">{{ lang === 'tr' ? 'Seçiniz' : 'Select' }}</option>
                  <option *ngFor="let c of cities" [value]="c">{{ c }}</option>
                  <option value="__other__">{{ lang === 'tr' ? 'Diğer' : 'Other' }}</option>
                </select>
              </div>
              <div class="fw other-input" *ngIf="registerCity === '__other__'">
                <input type="text" [(ngModel)]="registerCityOther"
                       [placeholder]="lang === 'tr' ? 'Şehir adını giriniz' : 'Enter city name'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ÜNİVERSİTE' : 'UNIVERSITY' }}</label>
              <div class="fw">
                <select [(ngModel)]="registerUniversity" [disabled]="!registerCity" (change)="onRegUniversityChange()">
                  <option value="">{{ !registerCity ? (lang === 'tr' ? 'Önce şehir seçiniz' : 'Select city first') : (lang === 'tr' ? 'Üniversite seçiniz' : 'Select university') }}</option>
                  <option *ngFor="let u of regFilteredUniversities" [value]="u">{{ u }}</option>
                  <option value="__other__">{{ lang === 'tr' ? 'Diğer' : 'Other' }}</option>
                </select>
              </div>
              <div class="fw other-input" *ngIf="registerUniversity === '__other__'">
                <input type="text" [(ngModel)]="registerUniversityOther"
                       [placeholder]="lang === 'tr' ? 'Üniversite adını giriniz' : 'Enter university name'" />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'FAKÜLTE' : 'FACULTY' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerFaculty" [disabled]="!registerUniversity" (change)="onRegFacultyChange()">
                    <option value="">{{ !registerUniversity ? (lang === 'tr' ? 'Önce üniversite seçiniz' : 'Select university first') : (lang === 'tr' ? 'Fakülte seçiniz' : 'Select faculty') }}</option>
                    <option *ngFor="let f of faculties" [value]="f.name">{{ f.name }}</option>
                    <option value="__other__">{{ lang === 'tr' ? 'Diğer' : 'Other' }}</option>
                  </select>
                </div>
                <div class="fw other-input" *ngIf="registerFaculty === '__other__'">
                  <input type="text" [(ngModel)]="registerFacultyOther"
                         [placeholder]="lang === 'tr' ? 'Fakülte adı giriniz' : 'Enter faculty name'" />
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'BÖLÜM' : 'DEPARTMENT' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerDepartment" [disabled]="!registerFaculty">
                    <option value="">{{ !registerFaculty ? (lang === 'tr' ? 'Önce fakülte seçiniz' : 'Select faculty first') : (lang === 'tr' ? 'Bölüm seçiniz' : 'Select department') }}</option>
                    <option *ngFor="let d of filteredDepartments" [value]="d">{{ d }}</option>
                    <option value="__other__">{{ lang === 'tr' ? 'Diğer' : 'Other' }}</option>
                  </select>
                </div>
                <div class="fw other-input" *ngIf="registerDepartment === '__other__'">
                  <input type="text" [(ngModel)]="registerDepartmentOther"
                         [placeholder]="lang === 'tr' ? 'Bölüm adı giriniz' : 'Enter department name'" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'OKUL NUMARASI' : 'STUDENT ID' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerStudentId"
                       [placeholder]="lang === 'tr' ? 'Öğrenci numaranızı giriniz' : 'Enter your student ID'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ADRES' : 'ADDRESS' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerAddress"
                       [placeholder]="lang === 'tr' ? 'Açık adresinizi giriniz' : 'Enter your full address'" />
              </div>
            </div>

            <!-- ✅ YENİ: Diploma PDF Yükleme Alanı -->
            <div class="field">
              <label class="fl">
                {{ lang === 'tr' ? 'DİPLOMA PDF (OPSİYONEL)' : 'DIPLOMA PDF (OPTIONAL)' }}
              </label>
              <div class="upload-zone" (click)="triggerFileInput()" [class.has-file]="diplomaFile">
                <input type="file" id="diploma-file-input" accept=".pdf" hidden (change)="onDiplomaFileSelected($event)" />
                <svg *ngIf="!diplomaFile" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <svg *ngIf="diplomaFile" viewBox="0 0 24 24" fill="none" stroke="#52c97a" stroke-width="1.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span *ngIf="!diplomaFile">{{ lang === 'tr' ? 'PDF yüklemek için tıklayın' : 'Click to upload PDF' }}</span>
                <span *ngIf="diplomaFile" class="file-name">{{ diplomaFile.name }}</span>
              </div>
              <p class="field-hint-green" *ngIf="diplomaFile">
                {{ lang === 'tr' ? '✓ Diploma yüklendi — blockchain üzerinde doğrulanacak' : '✓ Diploma uploaded — will be verified on blockchain' }}
              </p>
              <p class="upload-hint" *ngIf="!diplomaFile">
                {{ lang === 'tr' ? 'Diplomanızı yüklerseniz kayıt sırasında blockchain üzerinde doğrulanır' : 'Upload your diploma to verify it on blockchain during registration' }}
              </p>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'GÜVENLİK SORUSU' : 'SECURITY QUESTION' }}</label>
                <div class="fw">
                  <select [(ngModel)]="securityQuestion">
                    <option value="">{{ lang === 'tr' ? 'Soru seçiniz' : 'Select question' }}</option>
                    <option value="q1">{{ lang === 'tr' ? 'Anne kızlık soyadı?' : 'Mothers maiden name?' }}</option>
                    <option value="q2">{{ lang === 'tr' ? 'İlk evcil hayvan adı?' : 'First pets name?' }}</option>
                    <option value="q3">{{ lang === 'tr' ? 'Doğduğunuz şehir?' : 'City of birth?' }}</option>
                    <option value="q4">{{ lang === 'tr' ? 'İlk okul adı?' : 'Name of first school?' }}</option>
                    <option value="q5">{{ lang === 'tr' ? 'En sevdiğiniz öğretmen?' : 'Favorite teacher?' }}</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'CEVAP' : 'ANSWER' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="securityAnswer"
                         [placeholder]="lang === 'tr' ? 'Cevabınızı giriniz' : 'Enter your answer'" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ŞİFRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw2 ? 'text' : 'password'" [(ngModel)]="registerPassword"
                       (input)="checkStrength(registerPassword)"
                       [placeholder]="lang === 'tr' ? 'Güçlü bir şifre seçin' : 'Choose a strong password'" />
                <button class="eye-btn" (click)="showPw2 = !showPw2">
                  <svg *ngIf="!showPw2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
              <div class="strength-bar">
                <div class="sb" [class]="strength >= 1 ? strengthClass : ''"></div>
                <div class="sb" [class]="strength >= 2 ? strengthClass : ''"></div>
                <div class="sb" [class]="strength >= 3 ? strengthClass : ''"></div>
                <div class="sb" [class]="strength >= 4 ? strengthClass : ''"></div>
              </div>
            </div>

            <div class="checks">
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="acceptTerms" />
                <span class="checkmark"></span>
                <span class="check-text">
                  <a href="#" (click)="$event.preventDefault()">{{ lang === 'tr' ? 'Kullanım Sözleşmesi' : 'Terms of Service' }}</a>{{ lang === 'tr' ? 'ni okudum ve kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="acceptKvkk" />
                <span class="checkmark"></span>
                <span class="check-text">
                  <a href="#" (click)="$event.preventDefault()">{{ lang === 'tr' ? 'KVKK Aydınlatma Metni' : 'Privacy Policy' }}</a>{{ lang === 'tr' ? ' ve Gizlilik Politikasını kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
            </div>

            <button class="action-btn"
                    [disabled]="!registerFirstName || !registerLastName || !registerUsername || !usernameValid || !registerEmail || !registerCity || !registerUniversity || !registerFaculty || !registerDepartment || !registerStudentId || !registerAddress || !securityQuestion || !securityAnswer || !registerPassword || !acceptTerms || !acceptKvkk || registering"
                    (click)="register()">
              <span *ngIf="!registering">{{ registerSuccess ? (lang === 'tr' ? 'Kayıt Tamam!' : 'Done!') : (lang === 'tr' ? 'KAYIT OL' : 'REGISTER') }}</span>
              <span *ngIf="registering">{{ lang === 'tr' ? 'Doğrulanıyor...' : 'Verifying...' }}</span>
            </button>

            <div class="register-footer">
              {{ lang === 'tr' ? 'Zaten hesabın var mı?' : 'Already have an account?' }}
              <a href="#" (click)="$event.preventDefault(); view = 'LOGIN'">
                {{ lang === 'tr' ? 'Giriş Yap' : 'Sign In' }}
              </a>
            </div>
          </ng-container>

          <div *ngIf="message" class="result-box" [class.error-box]="isError">{{ message }}</div>

          <div class="card-footer">
            {{ lang === 'tr' ? 'Yardım için' : 'Need help?' }}
            <a href="#" (click)="$event.preventDefault()">
              {{ lang === 'tr' ? ' destek hattımıza başvurun' : ' contact support' }}
            </a>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 24px; font-family: 'DM Sans', 'Inter', system-ui, sans-serif; color: #e8e4d8; }
    #bg-canvas-g { position: fixed; inset: 0; z-index: 0; }
    .grid-overlay { position: fixed; inset: 0; z-index: 1; pointer-events: none; background-image: linear-gradient(rgba(100,180,120,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,120,.03) 1px, transparent 1px); background-size: 60px 60px; }
    .blob { position: fixed; border-radius: 50%; filter: blur(100px); z-index: 1; pointer-events: none; animation: blobFloat linear infinite; }
    .blob-1 { width: 500px; height: 500px; background: #0d3320; top: -150px; left: -150px; opacity: .35; animation-duration: 14s; }
    .blob-2 { width: 450px; height: 450px; background: #0a2818; bottom: -100px; right: -100px; opacity: .3; animation-duration: 17s; animation-delay: -6s; }
    .blob-3 { width: 280px; height: 280px; background: rgba(80,160,100,.12); top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: .4; animation-duration: 11s; animation-delay: -3s; }
    @keyframes blobFloat { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(25px,-35px) scale(1.06); } 66% { transform: translate(-18px,18px) scale(.95); } 100% { transform: translate(0,0) scale(1); } }
    .back-btn { position: fixed; top: 20px; left: 24px; z-index: 20; display: flex; align-items: center; gap: 6px; padding: 8px 18px; background: rgba(5,20,10,.7); border: 1px solid rgba(80,160,100,.25); border-radius: 100px; color: rgba(200,230,210,.5); font-size: 12px; font-weight: 500; cursor: pointer; backdrop-filter: blur(14px); transition: all .25s; font-family: 'DM Sans', 'Inter', sans-serif; }
    .back-btn:hover { background: rgba(80,160,100,.15); border-color: #50a064; color: #90d0a0; }
    .back-btn svg { width: 14px; height: 14px; }
    .lang-bar { position: fixed; top: 20px; right: 24px; z-index: 20; display: flex; background: rgba(5,20,10,.7); border: 1px solid rgba(80,160,100,.25); border-radius: 100px; backdrop-filter: blur(14px); overflow: hidden; }
    .lang-btn { padding: 8px 16px; font-size: 12px; font-weight: 600; border: none; background: none; color: rgba(200,230,210,.5); cursor: pointer; transition: all .25s; font-family: 'DM Sans', 'Inter', sans-serif; letter-spacing: .05em; }
    .lang-btn.active { background: rgba(80,160,100,.2); color: #90d0a0; }
    .wrapper { position: relative; z-index: 10; width: 100%; display: flex; align-items: center; justify-content: center; }
    .card { width: 100%; max-width: 480px; background: rgba(5,15,10,0.8); border: 1px solid rgba(80,160,100,.2); border-radius: 26px; padding: 48px 44px 42px; backdrop-filter: blur(24px); box-shadow: 0 0 0 1px rgba(80,160,100,.06), 0 40px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04); animation: cardIn .8s .2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }
    .card-header { text-align: center; margin-bottom: 32px; }
    .emblem { width: 62px; height: 62px; border-radius: 18px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3a9a58 0%, #1a5c30 100%); box-shadow: 0 8px 28px rgba(58,154,88,.35); }
    .emblem svg { width: 30px; height: 30px; }
    .card-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 27px; font-weight: 700; background: linear-gradient(135deg, #fff, #90d0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .card-sub { font-size: 13px; color: rgba(200,230,210,.45); margin-top: 5px; font-weight: 300; letter-spacing: .04em; }
    .tabs { display: flex; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 13px; padding: 4px; margin-bottom: 28px; }
    .tab { flex: 1; padding: 10px; text-align: center; font-size: 13px; font-weight: 500; border-radius: 10px; border: none; background: none; color: rgba(200,230,210,.45); cursor: pointer; transition: all .3s; font-family: 'DM Sans', 'Inter', sans-serif; }
    .tab.active { background: linear-gradient(135deg, #1a5c30, #2d8a4e); color: #fff; box-shadow: 0 4px 16px rgba(26,92,48,.5); }
    .field { margin-bottom: 18px; }
    .field-row { display: flex; gap: 12px; margin-bottom: 0; }
    .field-row .field { flex: 1; margin-bottom: 18px; }
    .fl { display: block; font-size: 11px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: #3a9a58; margin-bottom: 7px; }
    .fw { position: relative; display: flex; align-items: center; }
    input[type=text], input[type=email], input[type=password], select { width: 100%; padding: 13px 44px 13px 16px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 13px; color: #e8e4d8; font-family: 'DM Sans', 'Inter', sans-serif; font-size: 14px; font-weight: 300; outline: none; transition: all .3s; appearance: none; }
    input::placeholder { color: rgba(200,230,210,.25); }
    input:focus, select:focus { border-color: rgba(58,154,88,.5); background: rgba(58,154,88,.06); box-shadow: 0 0 0 3px rgba(58,154,88,.1); }
    select:disabled { opacity: .4; cursor: not-allowed; }
    select option { background: #061408; color: #e8e4d8; }
    .other-input { margin-top: 8px; }

    /* ✅ YENİ: Upload Zone Stilleri */
    .upload-zone {
      width: 100%; padding: 20px 16px; background: rgba(255,255,255,.03);
      border: 1.5px dashed rgba(58,154,88,.3); border-radius: 13px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      cursor: pointer; transition: all .3s; color: rgba(200,230,210,.5);
      font-size: 13px; text-align: center;
    }
    .upload-zone:hover { border-color: rgba(58,154,88,.6); background: rgba(58,154,88,.05); color: #90d0a0; }
    .upload-zone.has-file { border-color: rgba(58,154,88,.5); background: rgba(58,154,88,.08); border-style: solid; }
    .upload-zone svg { width: 24px; height: 24px; }
    .file-name { color: #52c97a; font-weight: 600; font-size: 12px; word-break: break-all; }
    .field-hint-green { font-size: 11px; color: #52c97a; margin-top: 6px; padding-left: 2px; }
    .upload-hint { font-size: 11px; color: rgba(200,230,210,.3); margin-top: 6px; padding-left: 2px; }

    .checks { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
    .check-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 12px; color: rgba(200,230,210,.55); line-height: 1.5; }
    .check-item input[type=checkbox] { display: none; }
    .checkmark { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; border: 1.5px solid rgba(255,255,255,.2); border-radius: 4px; background: rgba(255,255,255,.05); transition: all .2s; display: flex; align-items: center; justify-content: center; }
    .check-item input[type=checkbox]:checked + .checkmark { background: #3a9a58; border-color: #3a9a58; }
    .check-item input[type=checkbox]:checked + .checkmark::after { content: ''; width: 4px; height: 7px; border: 1.5px solid #fff; border-top: none; border-left: none; transform: rotate(45deg) translateY(-1px); display: block; }
    .check-text a { color: #3a9a58; text-decoration: none; }
    .check-text a:hover { color: #90d0a0; }
    .eye-btn { position: absolute; right: 12px; background: none; border: none; width: 18px; height: 18px; cursor: pointer; color: rgba(200,230,210,.35); padding: 0; transition: color .2s; display: flex; align-items: center; justify-content: center; }
    .eye-btn:hover { color: #90d0a0; }
    .eye-btn svg { width: 18px; height: 18px; }
    .username-status { position: absolute; right: 12px; display: flex; align-items: center; }
    .username-status svg { width: 16px; height: 16px; }
    .field-hint { font-size: 11px; color: #e05252; margin-top: 5px; padding-left: 2px; }
    .forgot { display: block; text-align: right; font-size: 12px; color: rgba(200,230,210,.45); text-decoration: none; margin: -8px 0 22px; transition: color .2s; }
    .forgot:hover { color: #90d0a0; }
    .strength-bar { display: flex; gap: 5px; margin-top: 8px; }
    .sb { flex: 1; height: 3px; border-radius: 99px; background: rgba(255,255,255,.08); transition: background .4s; }
    .sb.weak { background: #e05252; }
    .sb.medium { background: #e0a852; }
    .sb.strong { background: #52c97a; }
    .action-btn { width: 100%; padding: 15px; border: none; border-radius: 13px; font-family: 'DM Sans', 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; letter-spacing: .07em; cursor: pointer; background: linear-gradient(135deg, #1a5c30 0%, #2d8a4e 55%, #3a9a58 100%); background-size: 200%; color: #fff; transition: all .4s; box-shadow: 0 8px 24px rgba(26,92,48,.4); }
    .action-btn:hover:not(:disabled) { background-position: 100%; box-shadow: 0 12px 32px rgba(26,92,48,.6); transform: translateY(-1px); }
    .action-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
    .divider { height: 1px; background: rgba(255,255,255,.08); margin: 22px 0; }
    .edevlet-hint { font-size: 12px; color: rgba(200,230,210,.4); text-align: center; margin: 0 0 10px; line-height: 1.5; }
    .edevlet-hint em { font-style: italic; color: rgba(200,230,210,.65); }
    .social-row { display: flex; }
    .social-btn { flex: 1; padding: 14px 20px; background: #d0021b; border: none; border-radius: 13px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 14px; transition: all .3s; font-family: 'DM Sans', 'Inter', sans-serif; letter-spacing: .02em; box-shadow: 0 6px 24px rgba(208,2,27,.35); }
    .social-btn:hover { background: #b8001a; box-shadow: 0 10px 32px rgba(208,2,27,.5); transform: translateY(-1px); }
    .edevlet-logo { display: flex; align-items: center; }
    .edevlet-logo img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
    .register-footer { margin-top: 18px; text-align: center; font-size: 12px; color: rgba(200,230,210,.45); }
    .register-footer a { color: #3a9a58; text-decoration: none; font-weight: 500; margin-left: 4px; }
    .register-footer a:hover { color: #90d0a0; }
    .result-box { margin-top: 20px; padding: 14px; border-radius: 13px; background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.25); color: #90d0a0; font-size: 13px; line-height: 1.6; }
    .error-box { background: rgba(220,40,40,.1) !important; border-color: rgba(220,40,40,.25) !important; color: #ff9090 !important; }
    .card-footer { margin-top: 20px; text-align: center; font-size: 12px; color: rgba(200,230,210,.3); }
    .card-footer a { color: #3a9a58; text-decoration: none; font-weight: 500; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  `]
})
export class GraduateAuthPage implements OnInit, AfterViewInit, OnDestroy {
  view: AuthView = 'LOGIN';
  lang: 'tr' | 'en' = 'tr';

  loginEmail    = '';
  loginPassword = '';
  showPw1       = false;
  loginSuccess  = false;

  registerFirstName  = '';
  registerLastName   = '';
  registerUsername   = '';
  registerEmail      = '';
  registerCity       = '';
  registerCityOther  = '';
  registerUniversity = '';
  registerUniversityOther = '';
  registerFaculty    = '';
  registerFacultyOther    = '';
  registerDepartment = '';
  registerDepartmentOther = '';
  registerStudentId  = '';
  registerAddress    = '';
  securityQuestion   = '';
  securityAnswer     = '';
  acceptTerms        = false;
  acceptKvkk         = false;
  registerPassword   = '';
  showPw2            = false;
  registerSuccess    = false;
  registering        = false;
  usernameValid      = false;
  isError            = false;
  filteredDepartments: string[] = [];
  regFilteredUniversities: string[] = [];

  // ✅ YENİ: Diploma dosyası
  diplomaFile: File | null = null;

  onRegCityChange(): void {
    this.registerUniversity = '';
    this.registerUniversityOther = '';
    this.registerFaculty = '';
    this.registerFacultyOther = '';
    this.registerDepartment = '';
    this.registerDepartmentOther = '';
    this.filteredDepartments = [];
    const city = this.registerCity === '__other__' ? '' : this.registerCity;
    this.regFilteredUniversities = this.universities.filter(u => u.city === city).map(u => u.name);
  }

  onRegUniversityChange(): void {
    this.registerFaculty = '';
    this.registerFacultyOther = '';
    this.registerDepartment = '';
    this.registerDepartmentOther = '';
    this.filteredDepartments = [];
  }

  onRegFacultyChange(): void {
    this.registerDepartment = '';
    this.registerDepartmentOther = '';
    const f = this.faculties.find(f => f.name === this.registerFaculty);
    this.filteredDepartments = f ? f.departments : [];
  }

  // ✅ YENİ: Diploma dosyası seçme
  triggerFileInput(): void {
    document.getElementById('diploma-file-input')?.click();
  }

  onDiplomaFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.message = this.lang === 'tr' ? 'Lütfen sadece PDF dosyası yükleyin.' : 'Please upload only PDF files.';
        this.isError = true;
        return;
      }
      this.diplomaFile = file;
      this.message = '';
      this.isError = false;
    }
  }

  readonly faculties: { name: string; departments: string[] }[] = [
    { name: 'Mühendislik Fakültesi', departments: ['Bilgisayar Mühendisliği','Yazılım Mühendisliği','Elektrik-Elektronik Mühendisliği','Makine Mühendisliği','İnşaat Mühendisliği','Endüstri Mühendisliği','Kimya Mühendisliği','Biyomedikal Mühendisliği','Çevre Mühendisliği','Gıda Mühendisliği','Genetik ve Biyomühendislik','Havacılık ve Uzay Mühendisliği','Metalurji ve Malzeme Mühendisliği','Mekatronik Mühendisliği','Petrol ve Doğalgaz Mühendisliği','Tekstil Mühendisliği'] },
    { name: 'Tıp Fakültesi', departments: ['Tıp (Türkçe)','Tıp (İngilizce)'] },
    { name: 'Hukuk Fakültesi', departments: ['Hukuk'] },
    { name: 'İktisadi ve İdari Bilimler Fakültesi', departments: ['İktisat','İşletme','Kamu Yönetimi','Uluslararası İlişkiler','Siyaset Bilimi ve Kamu Yönetimi','Çalışma Ekonomisi ve Endüstri İlişkileri','Maliye','Ekonometri','Yönetim Bilişim Sistemleri','Sağlık Yönetimi','Muhasebe ve Finansman','Bankacılık ve Finans','Lojistik Yönetimi','Turizm İşletmeciliği'] },
    { name: 'Fen-Edebiyat Fakültesi', departments: ['Matematik','Fizik','Kimya','Biyoloji','İstatistik','Türk Dili ve Edebiyatı','Tarih','Coğrafya','Felsefe','Sosyoloji','Psikoloji','Arkeoloji','Sanat Tarihi','İngiliz Dili ve Edebiyatı','Fransız Dili ve Edebiyatı','Almanca','Japonca','Çince','Arap Dili ve Edebiyatı','Moleküler Biyoloji ve Genetik'] },
    { name: 'Eğitim Fakültesi', departments: ['Okul Öncesi Öğretmenliği','Sınıf Öğretmenliği','Fen Bilgisi Öğretmenliği','Matematik Öğretmenliği','Türkçe Öğretmenliği','Sosyal Bilgiler Öğretmenliği','İngilizce Öğretmenliği','Almanca Öğretmenliği','Biyoloji Öğretmenliği','Fizik Öğretmenliği','Kimya Öğretmenliği','Tarih Öğretmenliği','Özel Eğitim Öğretmenliği','Rehberlik ve Psikolojik Danışmanlık','Bilgisayar ve Öğretim Teknolojileri','Beden Eğitimi ve Spor Öğretmenliği','Müzik Öğretmenliği','Resim-İş Öğretmenliği'] },
    { name: 'Mimarlık Fakültesi', departments: ['Mimarlık','İç Mimarlık','Peyzaj Mimarlığı','Şehir ve Bölge Planlama','Endüstriyel Tasarım','Grafik Tasarım','Moda Tasarımı'] },
    { name: 'Güzel Sanatlar Fakültesi', departments: ['Resim','Heykel','Seramik','Grafik Tasarım','Tekstil ve Moda Tasarımı','Sinema-Televizyon','Fotoğraf ve Video','Geleneksel Türk El Sanatları','Müzik Teknolojisi'] },
    { name: 'İletişim Fakültesi', departments: ['Gazetecilik','Radyo Televizyon ve Sinema','Halkla İlişkiler ve Reklamcılık','Yeni Medya','İletişim Tasarımı','Sinema ve Dijital Medya'] },
    { name: 'Sağlık Bilimleri Fakültesi', departments: ['Hemşirelik','Ebelik','Fizyoterapi ve Rehabilitasyon','Beslenme ve Diyetetik','Çocuk Gelişimi','Sosyal Hizmet','Sağlık Yönetimi','Ergoterapi','Odyoloji','Dil ve Konuşma Terapisi'] },
    { name: 'Diş Hekimliği Fakültesi', departments: ['Diş Hekimliği'] },
    { name: 'Eczacılık Fakültesi', departments: ['Eczacılık'] },
    { name: 'Veteriner Fakültesi', departments: ['Veterinerlik'] },
    { name: 'Ziraat Fakültesi', departments: ['Ziraat Mühendisliği','Bahçe Bitkileri','Tarla Bitkileri','Toprak Bilimi ve Bitki Besleme','Bitki Koruma','Tarım Ekonomisi','Zootekni','Su Ürünleri Yetiştiriciliği'] },
    { name: 'İlahiyat Fakültesi', departments: ['İlahiyat','İslami İlimler'] },
    { name: 'Turizm Fakültesi', departments: ['Turizm İşletmeciliği','Otel Yöneticiliği','Rehberlik','Gastronomi ve Mutfak Sanatları'] },
    { name: 'Spor Bilimleri Fakültesi', departments: ['Beden Eğitimi ve Spor Öğretmenliği','Spor Yöneticiliği','Antrenörlük Eğitimi','Rekreasyon'] },
    { name: 'Denizcilik Fakültesi', departments: ['Denizcilik İşletmeleri Yönetimi','Gemi İnşaatı ve Deniz Teknolojisi','Deniz Ulaştırma İşletme Mühendisliği'] },
    { name: 'Orman Fakültesi', departments: ['Orman Mühendisliği','Orman Endüstrisi Mühendisliği','Peyzaj Mimarlığı'] },
  ];

  strength      = 0;
  strengthClass = '';
  message       = '';

  readonly edevletImg = EDEVLET_IMG;

  private splashEl: HTMLElement | null = null;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private pts: any[] = [];
  private animId?: number;
  private resizeHandler?: () => void;

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.splashEl = document.createElement('div');
    this.splashEl.innerHTML = `
      <div style="width:72px;height:72px;border-radius:22px;margin-bottom:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3a9a58,#1a5c30);box-shadow:0 0 40px rgba(58,154,88,.4)">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#90d0a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Mezun Portalı</div>
      <div style="font-size:13px;color:rgba(200,230,210,.5);letter-spacing:.1em;margin-top:6px">Kariyer yolculuğunuza hoş geldiniz</div>
      <div style="display:flex;gap:8px;margin-top:28px">
        <span style="width:8px;height:8px;border-radius:50%;background:#3a9a58;animation:spd 1.3s ease-in-out infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#90d0a0;animation:spd 1.3s ease-in-out .2s infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#a8c8e8;animation:spd 1.3s ease-in-out .4s infinite"></span>
      </div>
      <style>@keyframes spd{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.45)}}</style>
    `;
    Object.assign(this.splashEl.style, { position: 'fixed', inset: '0', zIndex: '99999', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 50%, #061408 0%, #020608 100%)', transition: 'opacity 0.9s ease', opacity: '1' });
    document.body.appendChild(this.splashEl);
    setTimeout(() => { if (this.splashEl) this.splashEl.style.opacity = '0'; }, 2200);
    setTimeout(() => { if (this.splashEl) { this.splashEl.remove(); this.splashEl = null; } }, 3100);
  }

  ngAfterViewInit(): void { setTimeout(() => this.initCanvas(), 50); }

  ngOnDestroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.splashEl) { this.splashEl.remove(); this.splashEl = null; }
  }

  private initCanvas(): void {
    this.canvas = document.getElementById('bg-canvas-g') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeHandler = () => { this.canvas!.width = window.innerWidth; this.canvas!.height = window.innerHeight; };
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
    this.pts = Array.from({ length: 130 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.4 + .3, a: Math.random() * .45 + .1, green: Math.random() > .7 }));
    const loop = () => {
      const W = this.canvas!.width, H = this.canvas!.height, c = this.ctx!;
      c.clearRect(0, 0, W, H);
      const g = c.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * .75);
      g.addColorStop(0, '#061408'); g.addColorStop(1, '#020608');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < this.pts.length; i++) {
        for (let j = i + 1; j < this.pts.length; j++) {
          const dx = this.pts[i].x - this.pts[j].x, dy = this.pts[i].y - this.pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 110) { c.strokeStyle = `rgba(58,154,88,${.05*(1-d/110)})`; c.lineWidth = .5; c.beginPath(); c.moveTo(this.pts[i].x, this.pts[i].y); c.lineTo(this.pts[j].x, this.pts[j].y); c.stroke(); }
        }
      }
      this.pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI*2); c.fillStyle = p.green ? `rgba(58,154,88,${p.a})` : `rgba(180,220,190,${p.a*.4})`; c.fill(); });
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  setLang(l: 'tr' | 'en'): void { this.lang = l; }
  checkUsername(username: string): void { this.usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username); }
  checkStrength(pw: string): void { let s = 0; if (pw.length >= 8) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++; this.strength = s; this.strengthClass = s <= 1 ? 'weak' : s <= 2 ? 'medium' : 'strong'; }

  login(): void {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          this.authService.saveSession(res.token, res.role);
          this.authService.loginAs('GRADUATE');
          this.loginSuccess = true;
          this.isError = false;
          this.message = 'Giriş başarılı. Yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/graduate']), 1200);
        } else {
          this.isError = true;
          this.message = res.message ?? 'Giriş başarısız.';
        }
      },
      error: (err: any) => {
        this.isError = true;
        this.message = err?.error?.message ?? 'Sunucuya bağlanılamadı.';
      }
    });
  }

  // ✅ YENİ: FormData ile kayıt + diploma PDF desteği
  register(): void {
    const fullName = `${this.registerFirstName} ${this.registerLastName}`.trim();
    const universityName = this.registerUniversity === '__other__' ? this.registerUniversityOther : this.registerUniversity;
    const department = this.registerDepartment === '__other__' ? this.registerDepartmentOther : this.registerDepartment;

    this.registering = true;
    this.message = '';
    this.isError = false;

    this.authService.registerGraduate({
      fullName,
      username: this.registerUsername,
      email: this.registerEmail,
      universityName,
      department,
      studentNumber: this.registerStudentId,
      password: this.registerPassword,
      diplomaFile: this.diplomaFile  // ✅ PDF dosyası gönderiliyor
    }).subscribe({
      next: (res: any) => {
        this.registering = false;
        if (res.status === 'SUCCESS') {
          this.registerSuccess = true;
          this.isError = false;
          this.message = res.message ?? (this.lang === 'tr' ? 'Kayıt başarılı! Giriş yapabilirsiniz.' : 'Registration complete. You can sign in.');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.view = 'LOGIN';
            this.registerSuccess = false;
            this.message = '';
            this.cdr.detectChanges();
          }, 3000);
        } else {
          this.isError = true;
          this.message = res.message ?? 'Kayıt başarısız.';
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        this.registering = false;
        this.isError = true;
        this.message = err?.error?.message ?? 'Kayıt sırasında hata oluştu.';
        this.cdr.detectChanges();
      }
    });
  }

  loginEdevlet(): void { this.message = this.lang === 'tr' ? 'e-Devlet entegrasyonu yakında aktif olacak.' : 'eGov integration coming soon.'; }
  goBack(): void { void this.router.navigate(['/login']); }

  readonly cities = ['Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kilis','Kırıkkale','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'];

  readonly universities: { name: string; city: string }[] = [
    {name:'Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi',city:'Adana'},{name:'Çukurova Üniversitesi',city:'Adana'},{name:'Adıyaman Üniversitesi',city:'Adıyaman'},{name:'Afyonkarahisar Sağlık Bilimleri Üniversitesi',city:'Afyonkarahisar'},{name:'Afyon Kocatepe Üniversitesi',city:'Afyonkarahisar'},{name:'Ağrı İbrahim Çeçen Üniversitesi',city:'Ağrı'},{name:'Aksaray Üniversitesi',city:'Aksaray'},{name:'Amasya Üniversitesi',city:'Amasya'},{name:'Ankara Üniversitesi',city:'Ankara'},{name:'Ankara Hacı Bayram Veli Üniversitesi',city:'Ankara'},{name:'Ankara Medipol Üniversitesi',city:'Ankara'},{name:'Ankara Müzik ve Güzel Sanatlar Üniversitesi',city:'Ankara'},{name:'Ankara Sosyal Bilimler Üniversitesi',city:'Ankara'},{name:'Ankara Yıldırım Beyazıt Üniversitesi',city:'Ankara'},{name:'Atılım Üniversitesi',city:'Ankara'},{name:'Başkent Üniversitesi',city:'Ankara'},{name:'Bilkent Üniversitesi',city:'Ankara'},{name:'Çankaya Üniversitesi',city:'Ankara'},{name:'Gazi Üniversitesi',city:'Ankara'},{name:'Hacettepe Üniversitesi',city:'Ankara'},{name:'Orta Doğu Teknik Üniversitesi',city:'Ankara'},{name:'Ostim Teknik Üniversitesi',city:'Ankara'},{name:'TED Üniversitesi',city:'Ankara'},{name:'TOBB Ekonomi ve Teknoloji Üniversitesi',city:'Ankara'},{name:'Türk Hava Kurumu Üniversitesi',city:'Ankara'},{name:'Ufuk Üniversitesi',city:'Ankara'},{name:'Akdeniz Üniversitesi',city:'Antalya'},{name:'Alanya Alaaddin Keykubat Üniversitesi',city:'Antalya'},{name:'Alanya HEP Üniversitesi',city:'Antalya'},{name:'Antalya Bilim Üniversitesi',city:'Antalya'},{name:'Ardahan Üniversitesi',city:'Ardahan'},{name:'Artvin Çoruh Üniversitesi',city:'Artvin'},{name:'Aydın Adnan Menderes Üniversitesi',city:'Aydın'},{name:'Balıkesir Üniversitesi',city:'Balıkesir'},{name:'Bandırma Onyedi Eylül Üniversitesi',city:'Balıkesir'},{name:'Bartın Üniversitesi',city:'Bartın'},{name:'Batman Üniversitesi',city:'Batman'},{name:'Bayburt Üniversitesi',city:'Bayburt'},{name:'Bilecik Şeyh Edebali Üniversitesi',city:'Bilecik'},{name:'Bingöl Üniversitesi',city:'Bingöl'},{name:'Bitlis Eren Üniversitesi',city:'Bitlis'},{name:'Bolu Abant İzzet Baysal Üniversitesi',city:'Bolu'},{name:'Mehmet Akif Ersoy Üniversitesi',city:'Burdur'},{name:'Bursa Teknik Üniversitesi',city:'Bursa'},{name:'Bursa Uludağ Üniversitesi',city:'Bursa'},{name:'Çanakkale Onsekiz Mart Üniversitesi',city:'Çanakkale'},{name:'Çankırı Karatekin Üniversitesi',city:'Çankırı'},{name:'Hitit Üniversitesi',city:'Çorum'},{name:'Pamukkale Üniversitesi',city:'Denizli'},{name:'Dicle Üniversitesi',city:'Diyarbakır'},{name:'Düzce Üniversitesi',city:'Düzce'},{name:'Trakya Üniversitesi',city:'Edirne'},{name:'Fırat Üniversitesi',city:'Elazığ'},{name:'Erzincan Binali Yıldırım Üniversitesi',city:'Erzincan'},{name:'Atatürk Üniversitesi',city:'Erzurum'},{name:'Erzurum Teknik Üniversitesi',city:'Erzurum'},{name:'Anadolu Üniversitesi',city:'Eskişehir'},{name:'Eskişehir Osmangazi Üniversitesi',city:'Eskişehir'},{name:'Eskişehir Teknik Üniversitesi',city:'Eskişehir'},{name:'Gaziantep İslam Bilim ve Teknoloji Üniversitesi',city:'Gaziantep'},{name:'Gaziantep Üniversitesi',city:'Gaziantep'},{name:'Hasan Kalyoncu Üniversitesi',city:'Gaziantep'},{name:'Sanko Üniversitesi',city:'Gaziantep'},{name:'Giresun Üniversitesi',city:'Giresun'},{name:'Gümüşhane Üniversitesi',city:'Gümüşhane'},{name:'Hakkari Üniversitesi',city:'Hakkari'},{name:'Hatay Mustafa Kemal Üniversitesi',city:'Hatay'},{name:'İskenderun Teknik Üniversitesi',city:'Hatay'},{name:'Iğdır Üniversitesi',city:'Iğdır'},{name:'Isparta Uygulamalı Bilimler Üniversitesi',city:'Isparta'},{name:'Süleyman Demirel Üniversitesi',city:'Isparta'},{name:'Altınbaş Üniversitesi',city:'İstanbul'},{name:'Bahçeşehir Üniversitesi',city:'İstanbul'},{name:'Beykent Üniversitesi',city:'İstanbul'},{name:'Beykoz Üniversitesi',city:'İstanbul'},{name:'Boğaziçi Üniversitesi',city:'İstanbul'},{name:'Fatih Sultan Mehmet Vakıf Üniversitesi',city:'İstanbul'},{name:'Galatasaray Üniversitesi',city:'İstanbul'},{name:'Haliç Üniversitesi',city:'İstanbul'},{name:'İstanbul Arel Üniversitesi',city:'İstanbul'},{name:'İstanbul Aydın Üniversitesi',city:'İstanbul'},{name:'İstanbul Bilgi Üniversitesi',city:'İstanbul'},{name:'İstanbul Esenyurt Üniversitesi',city:'İstanbul'},{name:'İstanbul Gedik Üniversitesi',city:'İstanbul'},{name:'İstanbul Kültür Üniversitesi',city:'İstanbul'},{name:'İstanbul Medeniyet Üniversitesi',city:'İstanbul'},{name:'İstanbul Medipol Üniversitesi',city:'İstanbul'},{name:'İstanbul Okan Üniversitesi',city:'İstanbul'},{name:'İstanbul Sabahattin Zaim Üniversitesi',city:'İstanbul'},{name:'İstanbul Teknik Üniversitesi',city:'İstanbul'},{name:'İstanbul Ticaret Üniversitesi',city:'İstanbul'},{name:'İstanbul Topkapı Üniversitesi',city:'İstanbul'},{name:'İstanbul Üniversitesi',city:'İstanbul'},{name:'İstanbul Üniversitesi-Cerrahpaşa',city:'İstanbul'},{name:'İstanbul 29 Mayıs Üniversitesi',city:'İstanbul'},{name:'Işık Üniversitesi',city:'İstanbul'},{name:'Kadir Has Üniversitesi',city:'İstanbul'},{name:'Koç Üniversitesi',city:'İstanbul'},{name:'Maltepe Üniversitesi',city:'İstanbul'},{name:'Marmara Üniversitesi',city:'İstanbul'},{name:'Mef Üniversitesi',city:'İstanbul'},{name:'Mimar Sinan Güzel Sanatlar Üniversitesi',city:'İstanbul'},{name:'Nişantaşı Üniversitesi',city:'İstanbul'},{name:'Özyeğin Üniversitesi',city:'İstanbul'},{name:'Piri Reis Üniversitesi',city:'İstanbul'},{name:'Sabancı Üniversitesi',city:'İstanbul'},{name:'Türk-Alman Üniversitesi',city:'İstanbul'},{name:'Üsküdar Üniversitesi',city:'İstanbul'},{name:'Yeditepe Üniversitesi',city:'İstanbul'},{name:'Yıldız Teknik Üniversitesi',city:'İstanbul'},{name:'Dokuz Eylül Üniversitesi',city:'İzmir'},{name:'Ege Üniversitesi',city:'İzmir'},{name:'İzmir Bakırçay Üniversitesi',city:'İzmir'},{name:'İzmir Demokrasi Üniversitesi',city:'İzmir'},{name:'İzmir Ekonomi Üniversitesi',city:'İzmir'},{name:'İzmir Kâtip Çelebi Üniversitesi',city:'İzmir'},{name:'İzmir Tınaztepe Üniversitesi',city:'İzmir'},{name:'Yaşar Üniversitesi',city:'İzmir'},{name:'Kahramanmaraş İstiklal Üniversitesi',city:'Kahramanmaraş'},{name:'Kahramanmaraş Sütçü İmam Üniversitesi',city:'Kahramanmaraş'},{name:'Karabük Üniversitesi',city:'Karabük'},{name:'Karaman Mehmetbey Üniversitesi',city:'Karaman'},{name:'Kafkas Üniversitesi',city:'Kars'},{name:'Kastamonu Üniversitesi',city:'Kastamonu'},{name:'Abdullah Gül Üniversitesi',city:'Kayseri'},{name:'Erciyes Üniversitesi',city:'Kayseri'},{name:'Nuh Naci Yazgan Üniversitesi',city:'Kayseri'},{name:'Kilis 7 Aralık Üniversitesi',city:'Kilis'},{name:'Kırıkkale Üniversitesi',city:'Kırıkkale'},{name:'Kırklareli Üniversitesi',city:'Kırklareli'},{name:'Kırşehir Ahi Evran Üniversitesi',city:'Kırşehir'},{name:'Gebze Teknik Üniversitesi',city:'Kocaeli'},{name:'Kocaeli Üniversitesi',city:'Kocaeli'},{name:'Konya Teknik Üniversitesi',city:'Konya'},{name:'KTO Karatay Üniversitesi',city:'Konya'},{name:'Necmettin Erbakan Üniversitesi',city:'Konya'},{name:'Selçuk Üniversitesi',city:'Konya'},{name:'Kütahya Dumlupınar Üniversitesi',city:'Kütahya'},{name:'Kütahya Sağlık Bilimleri Üniversitesi',city:'Kütahya'},{name:'İnönü Üniversitesi',city:'Malatya'},{name:'Malatya Turgut Özal Üniversitesi',city:'Malatya'},{name:'Manisa Celal Bayar Üniversitesi',city:'Manisa'},{name:'Mardin Artuklu Üniversitesi',city:'Mardin'},{name:'Mersin Üniversitesi',city:'Mersin'},{name:'Toros Üniversitesi',city:'Mersin'},{name:'Muğla Sıtkı Koçman Üniversitesi',city:'Muğla'},{name:'Muş Alparslan Üniversitesi',city:'Muş'},{name:'Nevşehir Hacı Bektaş Veli Üniversitesi',city:'Nevşehir'},{name:'Niğde Ömer Halisdemir Üniversitesi',city:'Niğde'},{name:'Ordu Üniversitesi',city:'Ordu'},{name:'Osmaniye Korkut Ata Üniversitesi',city:'Osmaniye'},{name:'Recep Tayyip Erdoğan Üniversitesi',city:'Rize'},{name:'Sakarya Uygulamalı Bilimler Üniversitesi',city:'Sakarya'},{name:'Sakarya Üniversitesi',city:'Sakarya'},{name:'Ondokuz Mayıs Üniversitesi',city:'Samsun'},{name:'Samsun Üniversitesi',city:'Samsun'},{name:'Siirt Üniversitesi',city:'Siirt'},{name:'Sinop Üniversitesi',city:'Sinop'},{name:'Sivas Bilim ve Teknoloji Üniversitesi',city:'Sivas'},{name:'Sivas Cumhuriyet Üniversitesi',city:'Sivas'},{name:'Harran Üniversitesi',city:'Şanlıurfa'},{name:'Şırnak Üniversitesi',city:'Şırnak'},{name:'Tekirdağ Namık Kemal Üniversitesi',city:'Tekirdağ'},{name:'Tokat Gaziosmanpaşa Üniversitesi',city:'Tokat'},{name:'Karadeniz Teknik Üniversitesi',city:'Trabzon'},{name:'Trabzon Üniversitesi',city:'Trabzon'},{name:'Munzur Üniversitesi',city:'Tunceli'},{name:'Uşak Üniversitesi',city:'Uşak'},{name:'Van Yüzüncü Yıl Üniversitesi',city:'Van'},{name:'Yalova Üniversitesi',city:'Yalova'},{name:'Yozgat Bozok Üniversitesi',city:'Yozgat'},{name:'Zonguldak Bülent Ecevit Üniversitesi',city:'Zonguldak'},
  ];
}
