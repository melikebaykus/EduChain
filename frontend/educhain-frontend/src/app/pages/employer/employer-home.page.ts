import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type AuthView = 'LOGIN' | 'REGISTER';

const EDEVLET_IMG = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEI=';

@Component({
  standalone: true,
  selector: 'app-employer-home',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <canvas id="bg-canvas-emp"></canvas>
      <div class="grid-overlay"></div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <button class="back-btn" (click)="goBack()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Geri
      </button>

      <div class="lang-bar">
        <button class="lang-btn" [class.active]="lang==='tr'" (click)="setLang('tr')">TR</button>
        <button class="lang-btn" [class.active]="lang==='en'" (click)="setLang('en')">EN</button>
      </div>

      <div class="wrapper">
        <div class="card">

          <div class="card-header">
            <div class="emblem">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <h1 class="card-title">{{ lang==='tr' ? 'İşveren Portalı' : 'Employer Portal' }}</h1>
            <p class="card-sub">{{ lang==='tr' ? 'Diploma doğrulama sistemine hoş geldiniz' : 'Welcome to diploma verification system' }}</p>
          </div>

          <div class="tabs">
            <button class="tab" [class.active]="view==='LOGIN'" (click)="view='LOGIN'">
              {{ lang==='tr' ? 'Giriş Yap' : 'Sign In' }}
            </button>
            <button class="tab" [class.active]="view==='REGISTER'" (click)="view='REGISTER'">
              {{ lang==='tr' ? 'Kayıt Ol' : 'Register' }}
            </button>
          </div>

          <!-- LOGIN -->
          <ng-container *ngIf="view==='LOGIN'">
            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'E-POSTA' : 'EMAIL' }}</label>
              <div class="fw">
                <input type="email" [(ngModel)]="loginEmail"
                  [placeholder]="lang==='tr' ? 'ornek@sirket.com' : 'example@company.com'" />
              </div>
            </div>
            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'ŞİFRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw1 ? 'text' : 'password'" [(ngModel)]="loginPassword"
                  [placeholder]="lang==='tr' ? 'Şifrenizi giriniz' : 'Enter your password'" />
                <button class="eye-btn" (click)="showPw1=!showPw1">
                  <svg *ngIf="!showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
            </div>
            <a class="forgot" href="#" (click)="$event.preventDefault()">
              {{ lang==='tr' ? 'Şifremi unuttum' : 'Forgot password' }} &rarr;
            </a>
            <button class="action-btn" [disabled]="!loginEmail||!loginPassword" (click)="login()">
              {{ loginSuccess ? (lang==='tr' ? 'Giriş Başarılı!' : 'Success!') : (lang==='tr' ? 'GİRİŞ YAP' : 'SIGN IN') }}
            </button>
            <div class="divider"></div>
            <p class="edevlet-hint">
              <em>turkiye.gov.tr</em> {{ lang==='tr' ? 'hesabınız ile de giriş yapabilirsiniz.' : 'You can also sign in with your account.' }}
            </p>
            <div class="social-row">
              <button class="social-btn" (click)="loginEdevlet()">
                <span class="edevlet-logo"><img [src]="edevletImg" alt="e-Devlet" /></span>
                {{ lang==='tr' ? 'e-Devlet ile Giriş Yap' : 'Sign in with eGov' }}
              </button>
            </div>
          </ng-container>

          <!-- REGISTER -->
          <ng-container *ngIf="view==='REGISTER'">
            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'KURUM / ŞİRKET ADI' : 'COMPANY NAME' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerCompany"
                  [placeholder]="lang==='tr' ? 'Şirket adını giriniz' : 'Enter company name'" />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang==='tr' ? 'SEKTÖR' : 'SECTOR' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerSector">
                    <option value="">{{ lang==='tr' ? 'Seçiniz' : 'Select' }}</option>
                    <option value="Teknoloji">{{ lang==='tr' ? 'Teknoloji' : 'Technology' }}</option>
                    <option value="Finans">{{ lang==='tr' ? 'Finans' : 'Finance' }}</option>
                    <option value="Saglik">{{ lang==='tr' ? 'Sağlık' : 'Healthcare' }}</option>
                    <option value="Egitim">{{ lang==='tr' ? 'Eğitim' : 'Education' }}</option>
                    <option value="Insaat">{{ lang==='tr' ? 'İnşaat' : 'Construction' }}</option>
                    <option value="Perakende">{{ lang==='tr' ? 'Perakende' : 'Retail' }}</option>
                    <option value="Medya">{{ lang==='tr' ? 'Medya' : 'Media' }}</option>
                    <option value="__other__">{{ lang==='tr' ? 'Diğer' : 'Other' }}</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang==='tr' ? 'MERSİS NO' : 'MERSIS NO' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="registerMersis"
                    [placeholder]="lang==='tr' ? '16 haneli Mersis no' : '16-digit Mersis no'"
                    maxlength="16" />
                </div>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang==='tr' ? 'ŞEHİR / İL' : 'CITY' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerCity">
                    <option value="">{{ lang==='tr' ? 'Seçiniz' : 'Select' }}</option>
                    <option *ngFor="let c of cities" [value]="c">{{ c }}</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang==='tr' ? 'TELEFON' : 'PHONE' }}</label>
                <div class="fw">
                  <input type="tel" [(ngModel)]="registerPhone" placeholder="+90 5__ ___ __ __" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'E-POSTA' : 'EMAIL' }}</label>
              <div class="fw">
                <input type="email" [(ngModel)]="registerEmail"
                  [placeholder]="lang==='tr' ? 'ornek@sirket.com' : 'example@company.com'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'ŞİFRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw2 ? 'text' : 'password'" [(ngModel)]="registerPassword"
                  (input)="checkStrength(registerPassword)"
                  [placeholder]="lang==='tr' ? 'Güçlü bir şifre seçin' : 'Choose a strong password'" />
                <button class="eye-btn" (click)="showPw2=!showPw2">
                  <svg *ngIf="!showPw2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
              <div class="strength-bar">
                <div class="sb" [class]="strength>=1?strengthClass:''"></div>
                <div class="sb" [class]="strength>=2?strengthClass:''"></div>
                <div class="sb" [class]="strength>=3?strengthClass:''"></div>
                <div class="sb" [class]="strength>=4?strengthClass:''"></div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang==='tr' ? 'ŞİFRE TEKRARI' : 'CONFIRM PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw3 ? 'text' : 'password'" [(ngModel)]="registerPasswordConfirm"
                  [placeholder]="lang==='tr' ? 'Şifrenizi tekrar giriniz' : 'Re-enter your password'"
                  [class.input-error]="registerPasswordConfirm && registerPassword !== registerPasswordConfirm"
                  [class.input-ok]="registerPasswordConfirm && registerPassword === registerPasswordConfirm" />
                <button class="eye-btn" (click)="showPw3=!showPw3">
                  <svg *ngIf="!showPw3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
              <p class="field-hint error" *ngIf="registerPasswordConfirm && registerPassword !== registerPasswordConfirm">
                {{ lang==='tr' ? 'Şifreler eşleşmiyor' : 'Passwords do not match' }}
              </p>
              <p class="field-hint ok" *ngIf="registerPasswordConfirm && registerPassword === registerPasswordConfirm">
                {{ lang==='tr' ? 'Şifreler eşleşiyor' : 'Passwords match' }}
              </p>
            </div>

            <div class="checks">
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="acceptTerms" />
                <span class="checkmark"></span>
                <span class="check-text">
                  <a href="#" (click)="$event.preventDefault()">{{ lang==='tr' ? 'Kullanım Sözleşmesi' : 'Terms of Service' }}</a>{{ lang==='tr' ? 'ni okudum ve kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="acceptKvkk" />
                <span class="checkmark"></span>
                <span class="check-text">
                  <a href="#" (click)="$event.preventDefault()">{{ lang==='tr' ? 'KVKK Aydınlatma Metni' : 'Privacy Policy' }}</a>{{ lang==='tr' ? ' ve Gizlilik Politikasını kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
            </div>

            <button class="action-btn"
              [disabled]="!registerCompany||!registerSector||!registerMersis||!registerCity||!registerPhone||!registerEmail||!registerPassword||registerPassword!==registerPasswordConfirm||!acceptTerms||!acceptKvkk"
              (click)="register()">
              {{ registerSuccess ? (lang==='tr' ? 'Kayıt Tamam!' : 'Done!') : (lang==='tr' ? 'KAYIT OL' : 'REGISTER') }}
            </button>

            <div class="register-footer">
              {{ lang==='tr' ? 'Zaten hesabın var mı?' : 'Already have an account?' }}
              <a href="#" (click)="$event.preventDefault(); view='LOGIN'">
                {{ lang==='tr' ? 'Giriş Yap' : 'Sign In' }}
              </a>
            </div>
          </ng-container>

          <div *ngIf="message" class="result-box">{{ message }}</div>

          <div class="card-footer">
            {{ lang==='tr' ? 'Yardım için' : 'Need help?' }}
            <a href="#" (click)="$event.preventDefault()">
              {{ lang==='tr' ? ' destek hattımıza başvurun' : ' contact support' }}
            </a>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 24px; font-family: 'DM Sans','Inter',system-ui,sans-serif; color: #f0e8d8; }
    #bg-canvas-emp { position: fixed; inset: 0; z-index: 0; }
    .grid-overlay { position: fixed; inset: 0; z-index: 1; pointer-events: none; background-image: linear-gradient(rgba(109,40,217,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,.03) 1px, transparent 1px); background-size: 60px 60px; }
    .blob { position: fixed; border-radius: 50%; filter: blur(100px); z-index: 1; pointer-events: none; animation: blobFloat linear infinite; }
    .blob-1 { width: 500px; height: 500px; background: #1e1050; top: -150px; left: -150px; opacity: .4; animation-duration: 14s; }
    .blob-2 { width: 450px; height: 450px; background: #130a3a; bottom: -100px; right: -100px; opacity: .35; animation-duration: 17s; animation-delay: -6s; }
    .blob-3 { width: 280px; height: 280px; background: rgba(109,40,217,.12); top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: .4; animation-duration: 11s; animation-delay: -3s; }
    @keyframes blobFloat { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(25px,-35px) scale(1.06)} 66%{transform:translate(-18px,18px) scale(.95)} 100%{transform:translate(0,0) scale(1)} }
    .back-btn { position: fixed; top: 20px; left: 24px; z-index: 20; display: flex; align-items: center; gap: 6px; padding: 8px 18px; background: rgba(15,5,40,.7); border: 1px solid rgba(109,40,217,.25); border-radius: 100px; color: rgba(196,181,253,.5); font-size: 12px; font-weight: 500; cursor: pointer; backdrop-filter: blur(14px); transition: all .25s; font-family: 'DM Sans','Inter',sans-serif; }
    .back-btn:hover { background: rgba(109,40,217,.15); border-color: #6d28d9; color: #c4b5fd; }
    .back-btn svg { width: 14px; height: 14px; }
    .lang-bar { position: fixed; top: 20px; right: 24px; z-index: 20; display: flex; background: rgba(15,5,40,.7); border: 1px solid rgba(109,40,217,.25); border-radius: 100px; backdrop-filter: blur(14px); overflow: hidden; }
    .lang-btn { padding: 8px 16px; font-size: 12px; font-weight: 600; border: none; background: none; color: rgba(196,181,253,.5); cursor: pointer; transition: all .25s; font-family: 'DM Sans','Inter',sans-serif; letter-spacing: .05em; }
    .lang-btn.active { background: rgba(109,40,217,.2); color: #c4b5fd; }
    .wrapper { position: relative; z-index: 10; width: 100%; display: flex; align-items: center; justify-content: center; }
    .card { width: 100%; max-width: 480px; background: rgba(12,5,35,0.82); border: 1px solid rgba(109,40,217,.2); border-radius: 26px; padding: 48px 44px 42px; backdrop-filter: blur(24px); box-shadow: 0 0 0 1px rgba(109,40,217,.06), 0 40px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04); animation: cardIn .8s .2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }
    .card-header { text-align: center; margin-bottom: 32px; }
    .emblem { width: 62px; height: 62px; border-radius: 18px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #6d28d9 0%, #3b1a78 100%); box-shadow: 0 8px 28px rgba(109,40,217,.4); }
    .emblem svg { width: 30px; height: 30px; }
    .card-title { font-family: 'Cormorant Garamond',Georgia,serif; font-size: 27px; font-weight: 700; background: linear-gradient(135deg,#fff,#c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .card-sub { font-size: 13px; color: rgba(196,181,253,.45); margin-top: 5px; font-weight: 300; letter-spacing: .04em; }
    .tabs { display: flex; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 13px; padding: 4px; margin-bottom: 28px; }
    .tab { flex: 1; padding: 10px; text-align: center; font-size: 13px; font-weight: 500; border-radius: 10px; border: none; background: none; color: rgba(196,181,253,.45); cursor: pointer; transition: all .3s; font-family: 'DM Sans','Inter',sans-serif; }
    .tab.active { background: linear-gradient(135deg,#3b1a78,#5b21b6); color: #fff; box-shadow: 0 4px 16px rgba(59,26,120,.5); }
    .field { margin-bottom: 18px; }
    .field-row { display: flex; gap: 12px; }
    .field-row .field { flex: 1; margin-bottom: 18px; }
    .fl { display: block; font-size: 11px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: #6d28d9; margin-bottom: 7px; }
    .fw { position: relative; display: flex; align-items: center; }
    input[type=text], input[type=email], input[type=password], input[type=tel], select { width: 100%; padding: 13px 44px 13px 16px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 13px; color: #f0e8d8; font-family: 'DM Sans','Inter',sans-serif; font-size: 14px; font-weight: 300; outline: none; transition: all .3s; appearance: none; }
    input::placeholder { color: rgba(196,181,253,.25); }
    input:focus, select:focus { border-color: rgba(109,40,217,.5); background: rgba(109,40,217,.06); box-shadow: 0 0 0 3px rgba(109,40,217,.1); }
    select option { background: #120530; color: #f0e8d8; }
    .field-hint { font-size: 11px; margin-top: 5px; padding-left: 2px; }
    .field-hint.error { color: #e05252; }
    .field-hint.ok { color: #52c97a; }
    .input-error { border-color: rgba(224,82,82,.5) !important; box-shadow: 0 0 0 3px rgba(224,82,82,.1) !important; }
    .input-ok { border-color: rgba(82,201,122,.5) !important; box-shadow: 0 0 0 3px rgba(82,201,122,.1) !important; }
    .checks { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
    .check-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 12px; color: rgba(196,181,253,.55); line-height: 1.5; }
    .check-item input[type=checkbox] { display: none; }
    .checkmark { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; border: 1.5px solid rgba(255,255,255,.2); border-radius: 4px; background: rgba(255,255,255,.05); transition: all .2s; display: flex; align-items: center; justify-content: center; }
    .check-item input[type=checkbox]:checked + .checkmark { background: #6d28d9; border-color: #6d28d9; }
    .check-item input[type=checkbox]:checked + .checkmark::after { content: ''; width: 4px; height: 7px; border: 1.5px solid #fff; border-top: none; border-left: none; transform: rotate(45deg) translateY(-1px); display: block; }
    .check-text a { color: #6d28d9; text-decoration: none; }
    .check-text a:hover { color: #c4b5fd; }
    .eye-btn { position: absolute; right: 12px; background: none; border: none; width: 18px; height: 18px; cursor: pointer; color: rgba(196,181,253,.35); padding: 0; transition: color .2s; display: flex; align-items: center; justify-content: center; }
    .eye-btn:hover { color: #c4b5fd; }
    .eye-btn svg { width: 18px; height: 18px; }
    .forgot { display: block; text-align: right; font-size: 12px; color: rgba(196,181,253,.45); text-decoration: none; margin: -8px 0 22px; transition: color .2s; }
    .forgot:hover { color: #c4b5fd; }
    .strength-bar { display: flex; gap: 5px; margin-top: 8px; }
    .sb { flex: 1; height: 3px; border-radius: 99px; background: rgba(255,255,255,.08); transition: background .4s; }
    .sb.weak { background: #e05252; } .sb.medium { background: #e0a852; } .sb.strong { background: #52c97a; }
    .action-btn { width: 100%; padding: 15px; border: none; border-radius: 13px; font-family: 'DM Sans','Inter',sans-serif; font-size: 13.5px; font-weight: 600; letter-spacing: .07em; cursor: pointer; background: linear-gradient(135deg,#3b1a78 0%,#5b21b6 55%,#6d28d9 100%); background-size: 200%; color: #fff; transition: all .4s; box-shadow: 0 8px 24px rgba(59,26,120,.4); }
    .action-btn:hover:not(:disabled) { background-position: 100%; box-shadow: 0 12px 32px rgba(59,26,120,.6); transform: translateY(-1px); }
    .action-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
    .divider { height: 1px; background: rgba(255,255,255,.08); margin: 22px 0; }
    .edevlet-hint { font-size: 12px; color: rgba(196,181,253,.4); text-align: center; margin: 0 0 10px; line-height: 1.5; }
    .edevlet-hint em { font-style: italic; color: rgba(196,181,253,.65); }
    .social-row { display: flex; }
    .social-btn { flex: 1; padding: 14px 20px; background: #d0021b; border: none; border-radius: 13px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 14px; transition: all .3s; font-family: 'DM Sans','Inter',sans-serif; letter-spacing: .02em; box-shadow: 0 6px 24px rgba(208,2,27,.35); }
    .social-btn:hover { background: #b8001a; box-shadow: 0 10px 32px rgba(208,2,27,.5); transform: translateY(-1px); }
    .edevlet-logo { display: flex; align-items: center; }
    .edevlet-logo img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
    .register-footer { margin-top: 18px; text-align: center; font-size: 12px; color: rgba(196,181,253,.45); }
    .register-footer a { color: #6d28d9; text-decoration: none; font-weight: 500; margin-left: 4px; }
    .register-footer a:hover { color: #c4b5fd; }
    .result-box { margin-top: 20px; padding: 14px; border-radius: 13px; background: rgba(109,40,217,.1); border: 1px solid rgba(109,40,217,.25); color: #c4b5fd; font-size: 13px; line-height: 1.6; }
    .card-footer { margin-top: 20px; text-align: center; font-size: 12px; color: rgba(196,181,253,.3); }
    .card-footer a { color: #6d28d9; text-decoration: none; font-weight: 500; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  `]
})
export class EmployerHomePage implements OnInit, AfterViewInit, OnDestroy {
  view: AuthView = 'LOGIN';
  lang: 'tr' | 'en' = 'tr';

  loginEmail = ''; loginPassword = ''; showPw1 = false; loginSuccess = false;
  registerCompany = ''; registerSector = ''; registerSectorOther = '';
  registerMersis = ''; registerWebsite = ''; registerCity = '';
  registerPhone = ''; registerAddress = '';
  registerEmail = ''; registerPassword = ''; registerPasswordConfirm = '';
  showPw2 = false; showPw3 = false; registerSuccess = false;
  acceptTerms = false; acceptKvkk = false;
  strength = 0; strengthClass = ''; message = '';

  readonly cities = [
    'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya',
    'Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik',
    'Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum',
    'Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir',
    'Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta',
    'İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu',
    'Kayseri','Kilis','Kırıkkale','Kırklareli','Kırşehir','Kocaeli','Konya',
    'Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir',
    'Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
    'Şanlıurfa','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van',
    'Yalova','Yozgat','Zonguldak'
  ];

  readonly edevletImg = EDEVLET_IMG;
  private splashEl: HTMLElement | null = null;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private pts: any[] = [];
  private animId?: number;
  private resizeHandler?: () => void;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.splashEl = document.createElement('div');
    this.splashEl.innerHTML = `
      <div style="width:72px;height:72px;border-radius:22px;margin-bottom:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6d28d9,#3b1a78);box-shadow:0 0 40px rgba(109,40,217,.4)">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">İşveren Portalı</div>
      <div style="font-size:13px;color:rgba(196,181,253,.5);letter-spacing:.1em;margin-top:6px">Diploma doğrulama sistemine hoş geldiniz</div>
      <div style="display:flex;gap:8px;margin-top:28px">
        <span style="width:8px;height:8px;border-radius:50%;background:#6d28d9;animation:spd 1.3s ease-in-out infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#c4b5fd;animation:spd 1.3s ease-in-out .2s infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#a8c8e8;animation:spd 1.3s ease-in-out .4s infinite"></span>
      </div>
      <style>@keyframes spd{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.45)}}</style>
    `;
    Object.assign(this.splashEl.style, { position:'fixed', inset:'0', zIndex:'99999', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 50% 50%, #0e0530 0%, #020608 100%)', transition:'opacity 0.9s ease', opacity:'1' });
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
    this.canvas = document.getElementById('bg-canvas-emp') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeHandler = () => { this.canvas!.width = window.innerWidth; this.canvas!.height = window.innerHeight; };
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
    this.pts = Array.from({ length: 130 }, () => ({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.4+.3, a: Math.random()*.45+.1, warm: Math.random()>.7 }));
    const loop = () => {
      const W = this.canvas!.width, H = this.canvas!.height, c = this.ctx!;
      c.clearRect(0,0,W,H);
      const g = c.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.75);
      g.addColorStop(0,'#0e0530'); g.addColorStop(1,'#020608');
      c.fillStyle=g; c.fillRect(0,0,W,H);
      for (let i=0;i<this.pts.length;i++) for (let j=i+1;j<this.pts.length;j++) {
        const dx=this.pts[i].x-this.pts[j].x, dy=this.pts[i].y-this.pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<110) { c.strokeStyle=`rgba(109,40,217,${.05*(1-d/110)})`; c.lineWidth=.5; c.beginPath(); c.moveTo(this.pts[i].x,this.pts[i].y); c.lineTo(this.pts[j].x,this.pts[j].y); c.stroke(); }
      }
      this.pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
        c.beginPath(); c.arc(p.x,p.y,p.r,0,Math.PI*2);
        c.fillStyle=p.warm?`rgba(109,40,217,${p.a})`:`rgba(196,181,253,${p.a*.4})`; c.fill();
      });
      this.animId=requestAnimationFrame(loop);
    };
    loop();
  }

  setLang(l: 'tr'|'en'): void { this.lang=l; }

  checkStrength(pw: string): void {
    let s=0;
    if(pw.length>=8)s++; if(/[A-Z]/.test(pw))s++; if(/[0-9]/.test(pw))s++; if(/[^a-zA-Z0-9]/.test(pw))s++;
    this.strength=s; this.strengthClass=s<=1?'weak':s<=2?'medium':'strong';
  }

  login(): void {
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          this.auth.saveSession(res.token, res.role);
          this.auth.loginAs('EMPLOYER');
          this.loginSuccess = true;
          this.message = this.lang === 'tr' ? 'Giriş başarılı. Yönlendiriliyorsunuz...' : 'Login successful. Redirecting...';
          setTimeout(() => this.router.navigate(['/employer/dashboard']), 1200);
        } else {
          this.message = res.message ?? 'Giriş başarısız.';
        }
      },
      error: (err: any) => {
        this.message = err?.error?.message ?? 'Sunucuya bağlanılamadı.';
      }
    });
  }

  register(): void {
    this.auth.registerEmployer({
      institutionName: this.registerCompany,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          this.registerSuccess = true;
          this.message = this.lang === 'tr' ? 'Kayıt başarılı! Giriş yapabilirsiniz.' : 'Registration complete. You can sign in.';
          setTimeout(() => this.view = 'LOGIN', 1500);
        } else {
          this.message = res.message ?? 'Kayıt başarısız.';
        }
      },
      error: (err: any) => {
        this.message = err?.error?.message ?? 'Kayıt sırasında hata oluştu.';
      }
    });
  }

  loginEdevlet(): void {
    this.message = this.lang === 'tr' ? 'e-Devlet entegrasyonu yakında aktif olacak.' : 'eGov integration coming soon.';
  }

  goBack(): void { void this.router.navigate(['/login']); }
}
