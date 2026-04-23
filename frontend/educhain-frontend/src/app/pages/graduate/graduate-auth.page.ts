import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type AuthView = 'LOGIN' | 'REGISTER';

const EDEVLET_IMG = 'data:image/png;base64,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';

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
            <h1 class="card-title">{{ lang === 'tr' ? 'Mezun Portal\u0131' : 'Graduate Portal' }}</h1>
            <p class="card-sub">{{ lang === 'tr' ? 'Kariyer yolculu\u011funuza ho\u015f geldiniz' : 'Welcome to your career journey' }}</p>
          </div>

          <div class="tabs">
            <button class="tab" [class.active]="view === 'LOGIN'" (click)="view = 'LOGIN'">
              {{ lang === 'tr' ? 'Giri\u015f Yap' : 'Sign In' }}
            </button>
            <button class="tab" [class.active]="view === 'REGISTER'" (click)="view = 'REGISTER'">
              {{ lang === 'tr' ? 'Kay\u0131t Ol' : 'Register' }}
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
              <label class="fl">{{ lang === 'tr' ? '\u015e\u0130FRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw1 ? 'text' : 'password'" [(ngModel)]="loginPassword"
                  [placeholder]="lang === 'tr' ? '\u015eifrenizi giriniz' : 'Enter your password'" />
                <button class="eye-btn" (click)="showPw1 = !showPw1">
                  <svg *ngIf="!showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPw1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                </button>
              </div>
            </div>

            <a class="forgot" href="#" (click)="$event.preventDefault()">
              {{ lang === 'tr' ? '\u015eifremi unuttum' : 'Forgot password' }} &rarr;
            </a>

            <button class="action-btn" [disabled]="!loginEmail || !loginPassword" (click)="login()">
              {{ loginSuccess ? (lang === 'tr' ? 'Giri\u015f Ba\u015far\u0131l\u0131!' : 'Success!') : (lang === 'tr' ? 'G\u0130R\u0130\u015e YAP' : 'SIGN IN') }}
            </button>

            <div class="divider"></div>

            <p class="edevlet-hint">
              <em>turkiye.gov.tr</em> {{ lang === 'tr' ? 'hesab\u0131n\u0131z ile de giri\u015f yapabilirsiniz.' : 'You can also sign in with your account.' }}
            </p>
            <div class="social-row">
              <button class="social-btn" (click)="loginEdevlet()">
                <span class="edevlet-logo"><img [src]="edevletImg" alt="e-Devlet" /></span>
                {{ lang === 'tr' ? 'e-Devlet ile Giri\u015f Yap' : 'Sign in with eGov' }}
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
                    [placeholder]="lang === 'tr' ? 'Ad\u0131n\u0131z' : 'First name'" />
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'SOYAD' : 'LAST NAME' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="registerLastName"
                    [placeholder]="lang === 'tr' ? 'Soyad\u0131n\u0131z' : 'Last name'" />
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
              <label class="fl">{{ lang === 'tr' ? '\u015eEH\u0130R / \u0130L' : 'CITY' }}</label>
              <div class="fw">
                <select [(ngModel)]="registerCity" (change)="onRegCityChange()">
                  <option value="">{{ lang === 'tr' ? 'Se\u00e7iniz' : 'Select' }}</option>
                  <option *ngFor="let c of cities" [value]="c">{{ c }}</option>
                  <option value="__other__">{{ lang === 'tr' ? 'Di\u011fer' : 'Other' }}</option>
                </select>
              </div>
              <div class="fw other-input" *ngIf="registerCity === '__other__'">
                <input type="text" [(ngModel)]="registerCityOther"
                  [placeholder]="lang === 'tr' ? '\u015eehir ad\u0131n\u0131 giriniz' : 'Enter city name'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? '\u00dcN\u0130VERS\u0130TE' : 'UNIVERSITY' }}</label>
              <div class="fw">
                <select [(ngModel)]="registerUniversity" [disabled]="!registerCity" (change)="onRegUniversityChange()">
                  <option value="">{{ !registerCity ? (lang === 'tr' ? '\u00d6nce \u015fehir se\u00e7iniz' : 'Select city first') : (lang === 'tr' ? '\u00dcniversite se\u00e7iniz' : 'Select university') }}</option>
                  <option *ngFor="let u of regFilteredUniversities" [value]="u">{{ u }}</option>
                  <option value="__other__">{{ lang === 'tr' ? 'Di\u011fer' : 'Other' }}</option>
                </select>
              </div>
              <div class="fw other-input" *ngIf="registerUniversity === '__other__'">
                <input type="text" [(ngModel)]="registerUniversityOther"
                  [placeholder]="lang === 'tr' ? '\u00dcniversite ad\u0131n\u0131 giriniz' : 'Enter university name'" />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'FAK\u00dcLTE' : 'FACULTY' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerFaculty" [disabled]="!registerUniversity" (change)="onRegFacultyChange()">
                    <option value="">{{ !registerUniversity ? (lang === 'tr' ? '\u00d6nce \u00fcniversite se\u00e7iniz' : 'Select university first') : (lang === 'tr' ? 'Fak\u00fclte se\u00e7iniz' : 'Select faculty') }}</option>
                    <option *ngFor="let f of faculties" [value]="f.name">{{ f.name }}</option>
                    <option value="__other__">{{ lang === 'tr' ? 'Di\u011fer' : 'Other' }}</option>
                  </select>
                </div>
                <div class="fw other-input" *ngIf="registerFaculty === '__other__'">
                  <input type="text" [(ngModel)]="registerFacultyOther"
                    [placeholder]="lang === 'tr' ? 'Fak\u00fclte ad\u0131 giriniz' : 'Enter faculty name'" />
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'B\u00d6L\u00dcM' : 'DEPARTMENT' }}</label>
                <div class="fw">
                  <select [(ngModel)]="registerDepartment" [disabled]="!registerFaculty">
                    <option value="">{{ !registerFaculty ? (lang === 'tr' ? '\u00d6nce fak\u00fclte se\u00e7iniz' : 'Select faculty first') : (lang === 'tr' ? 'B\u00f6l\u00fcm se\u00e7iniz' : 'Select department') }}</option>
                    <option *ngFor="let d of filteredDepartments" [value]="d">{{ d }}</option>
                    <option value="__other__">{{ lang === 'tr' ? 'Di\u011fer' : 'Other' }}</option>
                  </select>
                </div>
                <div class="fw other-input" *ngIf="registerDepartment === '__other__'">
                  <input type="text" [(ngModel)]="registerDepartmentOther"
                    [placeholder]="lang === 'tr' ? 'B\u00f6l\u00fcm ad\u0131 giriniz' : 'Enter department name'" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'OKUL NUMARASI' : 'STUDENT ID' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerStudentId"
                  [placeholder]="lang === 'tr' ? '\u00d6\u011frenci numaran\u0131z\u0131 giriniz' : 'Enter your student ID'" />
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? 'ADRES' : 'ADDRESS' }}</label>
              <div class="fw">
                <input type="text" [(ngModel)]="registerAddress"
                  [placeholder]="lang === 'tr' ? 'Aç\u0131k adresinizi giriniz' : 'Enter your full address'" />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'G\u00dcVENL\u0130K SORUSU' : 'SECURITY QUESTION' }}</label>
                <div class="fw">
                  <select [(ngModel)]="securityQuestion">
                    <option value="">{{ lang === 'tr' ? 'Soru se\u00e7iniz' : 'Select question' }}</option>
                    <option value="q1">{{ lang === 'tr' ? 'Anne k\u0131zl\u0131k soyad\u0131?' : 'Mothers maiden name?' }}</option>
                    <option value="q2">{{ lang === 'tr' ? '\u0130lk evcil hayvan ad\u0131?' : 'First pets name?' }}</option>
                    <option value="q3">{{ lang === 'tr' ? 'Do\u011fdu\u011funuz \u015fehir?' : 'City of birth?' }}</option>
                    <option value="q4">{{ lang === 'tr' ? '\u0130lk okul ad\u0131?' : 'Name of first school?' }}</option>
                    <option value="q5">{{ lang === 'tr' ? 'En sevdi\u011finiz \u00f6\u011fretmen?' : 'Favorite teacher?' }}</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label class="fl">{{ lang === 'tr' ? 'CEVAP' : 'ANSWER' }}</label>
                <div class="fw">
                  <input type="text" [(ngModel)]="securityAnswer"
                    [placeholder]="lang === 'tr' ? 'Cevab\u0131n\u0131z\u0131 giriniz' : 'Enter your answer'" />
                </div>
              </div>
            </div>

            <div class="field">
              <label class="fl">{{ lang === 'tr' ? '\u015e\u0130FRE' : 'PASSWORD' }}</label>
              <div class="fw">
                <input [type]="showPw2 ? 'text' : 'password'" [(ngModel)]="registerPassword"
                  (input)="checkStrength(registerPassword)"
                  [placeholder]="lang === 'tr' ? 'G\u00fc\u00e7l\u00fc bir \u015fifre se\u00e7in' : 'Choose a strong password'" />
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
                  <a href="#" (click)="$event.preventDefault()">{{ lang === 'tr' ? 'Kullan\u0131m S\u00f6zle\u015fmesi' : 'Terms of Service' }}</a>{{ lang === 'tr' ? 'ni okudum ve kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
              <label class="check-item">
                <input type="checkbox" [(ngModel)]="acceptKvkk" />
                <span class="checkmark"></span>
                <span class="check-text">
                  <a href="#" (click)="$event.preventDefault()">{{ lang === 'tr' ? 'KVKK Ayd\u0131nlatma Metni' : 'Privacy Policy' }}</a>{{ lang === 'tr' ? ' ve Gizlilik Politikas\u0131n\u0131 kabul ediyorum.' : ' accepted.' }}
                </span>
              </label>
            </div>

            <button class="action-btn"
              [disabled]="!registerFirstName || !registerLastName || !registerUsername || !usernameValid || !registerEmail || !registerCity || !registerUniversity || !registerFaculty || !registerDepartment || !registerStudentId || !registerAddress || !securityQuestion || !securityAnswer || !registerPassword || !acceptTerms || !acceptKvkk"
              (click)="register()">
              {{ registerSuccess ? (lang === 'tr' ? 'Kay\u0131t Tamam!' : 'Done!') : (lang === 'tr' ? 'KAYIT OL' : 'REGISTER') }}
            </button>

            <div class="register-footer">
              {{ lang === 'tr' ? 'Zaten hesab\u0131n var m\u0131?' : 'Already have an account?' }}
              <a href="#" (click)="$event.preventDefault(); view = 'LOGIN'">
                {{ lang === 'tr' ? 'Giri\u015f Yap' : 'Sign In' }}
              </a>
            </div>
          </ng-container>

          <div *ngIf="message" class="result-box">{{ message }}</div>

          <div class="card-footer">
            {{ lang === 'tr' ? 'Yard\u0131m i\u00e7in' : 'Need help?' }}
            <a href="#" (click)="$event.preventDefault()">
              {{ lang === 'tr' ? ' destek hatt\u0131m\u0131za ba\u015fvurun' : ' contact support' }}
            </a>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; padding: 24px;
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      color: #e8e4d8;
    }

    #bg-canvas-g { position: fixed; inset: 0; z-index: 0; }

    .grid-overlay {
      position: fixed; inset: 0; z-index: 1; pointer-events: none;
      background-image:
        linear-gradient(rgba(100,180,120,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100,180,120,.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .blob {
      position: fixed; border-radius: 50%; filter: blur(100px);
      z-index: 1; pointer-events: none; animation: blobFloat linear infinite;
    }
    .blob-1 { width: 500px; height: 500px; background: #0d3320; top: -150px; left: -150px; opacity: .35; animation-duration: 14s; }
    .blob-2 { width: 450px; height: 450px; background: #0a2818; bottom: -100px; right: -100px; opacity: .3; animation-duration: 17s; animation-delay: -6s; }
    .blob-3 { width: 280px; height: 280px; background: rgba(80,160,100,.12); top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: .4; animation-duration: 11s; animation-delay: -3s; }

    @keyframes blobFloat {
      0%   { transform: translate(0,0) scale(1); }
      33%  { transform: translate(25px,-35px) scale(1.06); }
      66%  { transform: translate(-18px,18px) scale(.95); }
      100% { transform: translate(0,0) scale(1); }
    }

    .back-btn {
      position: fixed; top: 20px; left: 24px; z-index: 20;
      display: flex; align-items: center; gap: 6px; padding: 8px 18px;
      background: rgba(5,20,10,.7); border: 1px solid rgba(80,160,100,.25);
      border-radius: 100px; color: rgba(200,230,210,.5);
      font-size: 12px; font-weight: 500; cursor: pointer;
      backdrop-filter: blur(14px); transition: all .25s;
      font-family: 'DM Sans', 'Inter', sans-serif;
    }
    .back-btn:hover { background: rgba(80,160,100,.15); border-color: #50a064; color: #90d0a0; }
    .back-btn svg { width: 14px; height: 14px; }

    .lang-bar {
      position: fixed; top: 20px; right: 24px; z-index: 20;
      display: flex; background: rgba(5,20,10,.7);
      border: 1px solid rgba(80,160,100,.25); border-radius: 100px;
      backdrop-filter: blur(14px); overflow: hidden;
    }
    .lang-btn {
      padding: 8px 16px; font-size: 12px; font-weight: 600;
      border: none; background: none; color: rgba(200,230,210,.5);
      cursor: pointer; transition: all .25s;
      font-family: 'DM Sans', 'Inter', sans-serif; letter-spacing: .05em;
    }
    .lang-btn.active { background: rgba(80,160,100,.2); color: #90d0a0; }

    .wrapper { position: relative; z-index: 10; width: 100%; display: flex; align-items: center; justify-content: center; }

    .card {
      width: 100%; max-width: 480px;
      background: rgba(5,15,10,0.8); border: 1px solid rgba(80,160,100,.2); border-radius: 26px;
      padding: 48px 44px 42px; backdrop-filter: blur(24px);
      box-shadow: 0 0 0 1px rgba(80,160,100,.06), 0 40px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04);
      animation: cardIn .8s .2s cubic-bezier(.16,1,.3,1) both;
    }
    @keyframes cardIn { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }

    .card-header { text-align: center; margin-bottom: 32px; animation: fadeUp .6s .15s both; }
    .emblem {
      width: 62px; height: 62px; border-radius: 18px; margin: 0 auto 16px;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #3a9a58 0%, #1a5c30 100%);
      box-shadow: 0 8px 28px rgba(58,154,88,.35);
    }
    .emblem svg { width: 30px; height: 30px; }
    .card-title {
      font-family: 'Cormorant Garamond', Georgia, serif; font-size: 27px; font-weight: 700;
      background: linear-gradient(135deg, #fff, #90d0a0);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .card-sub { font-size: 13px; color: rgba(200,230,210,.45); margin-top: 5px; font-weight: 300; letter-spacing: .04em; }

    .tabs {
      display: flex; background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.07); border-radius: 13px;
      padding: 4px; margin-bottom: 28px; animation: fadeUp .6s .25s both;
    }
    .tab {
      flex: 1; padding: 10px; text-align: center; font-size: 13px; font-weight: 500;
      border-radius: 10px; border: none; background: none; color: rgba(200,230,210,.45);
      cursor: pointer; transition: all .3s; font-family: 'DM Sans', 'Inter', sans-serif;
    }
    .tab.active { background: linear-gradient(135deg, #1a5c30, #2d8a4e); color: #fff; box-shadow: 0 4px 16px rgba(26,92,48,.5); }

    .field { margin-bottom: 18px; animation: fadeUp .5s both; }
    .field-row { display: flex; gap: 12px; margin-bottom: 0; }
    .field-row .field { flex: 1; margin-bottom: 18px; }
    .fl {
      display: block; font-size: 11px; font-weight: 600;
      letter-spacing: .09em; text-transform: uppercase;
      color: #3a9a58; margin-bottom: 7px;
    }
    .fw { position: relative; display: flex; align-items: center; }

    input[type=text], input[type=email], input[type=password], select {
      width: 100%; padding: 13px 44px 13px 16px;
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
      border-radius: 13px; color: #e8e4d8;
      font-family: 'DM Sans', 'Inter', sans-serif; font-size: 14px; font-weight: 300;
      outline: none; transition: all .3s; appearance: none;
    }
    input::placeholder { color: rgba(200,230,210,.25); }
    input:focus, select:focus {
      border-color: rgba(58,154,88,.5); background: rgba(58,154,88,.06);
      box-shadow: 0 0 0 3px rgba(58,154,88,.1);
    }
    select:disabled { opacity: .4; cursor: not-allowed; }
    select option { background: #061408; color: #e8e4d8; }
    .other-input { margin-top: 8px; }
    .checks { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
    .check-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 12px; color: rgba(200,230,210,.55); line-height: 1.5; }
    .check-item input[type=checkbox] { display: none; }
    .checkmark { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; border: 1.5px solid rgba(255,255,255,.2); border-radius: 4px; background: rgba(255,255,255,.05); transition: all .2s; display: flex; align-items: center; justify-content: center; }
    .check-item input[type=checkbox]:checked + .checkmark { background: #3a9a58; border-color: #3a9a58; }
    .check-item input[type=checkbox]:checked + .checkmark::after { content: ''; width: 4px; height: 7px; border: 1.5px solid #fff; border-top: none; border-left: none; transform: rotate(45deg) translateY(-1px); display: block; }
    .check-text a { color: #3a9a58; text-decoration: none; }
    .check-text a:hover { color: #90d0a0; }

    .eye-btn {
      position: absolute; right: 12px; background: none; border: none;
      width: 18px; height: 18px; cursor: pointer;
      color: rgba(200,230,210,.35); padding: 0; transition: color .2s;
      display: flex; align-items: center; justify-content: center;
    }
    .eye-btn:hover { color: #90d0a0; }
    .eye-btn svg { width: 18px; height: 18px; }

    .username-status {
      position: absolute; right: 12px;
      display: flex; align-items: center;
    }
    .username-status svg { width: 16px; height: 16px; }

    .field-hint {
      font-size: 11px; color: #e05252;
      margin-top: 5px; padding-left: 2px;
    }

    .forgot {
      display: block; text-align: right; font-size: 12px; color: rgba(200,230,210,.45);
      text-decoration: none; margin: -8px 0 22px; transition: color .2s;
    }
    .forgot:hover { color: #90d0a0; }

    .strength-bar { display: flex; gap: 5px; margin-top: 8px; }
    .sb { flex: 1; height: 3px; border-radius: 99px; background: rgba(255,255,255,.08); transition: background .4s; }
    .sb.weak   { background: #e05252; }
    .sb.medium { background: #e0a852; }
    .sb.strong { background: #52c97a; }

    .action-btn {
      width: 100%; padding: 15px; border: none; border-radius: 13px;
      font-family: 'DM Sans', 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
      letter-spacing: .07em; cursor: pointer;
      background: linear-gradient(135deg, #1a5c30 0%, #2d8a4e 55%, #3a9a58 100%);
      background-size: 200%; color: #fff; transition: all .4s;
      box-shadow: 0 8px 24px rgba(26,92,48,.4);
    }
    .action-btn:hover:not(:disabled) {
      background-position: 100%; box-shadow: 0 12px 32px rgba(26,92,48,.6); transform: translateY(-1px);
    }
    .action-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

    .divider { height: 1px; background: rgba(255,255,255,.08); margin: 22px 0; }

    .edevlet-hint {
      font-size: 12px; color: rgba(200,230,210,.4);
      text-align: center; margin: 0 0 10px; line-height: 1.5;
    }
    .edevlet-hint em { font-style: italic; color: rgba(200,230,210,.65); }

    .social-row { display: flex; }
    .social-btn {
      flex: 1; padding: 14px 20px;
      background: #d0021b; border: none; border-radius: 13px; color: #fff;
      font-size: 15px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 14px;
      transition: all .3s; font-family: 'DM Sans', 'Inter', sans-serif;
      letter-spacing: .02em; box-shadow: 0 6px 24px rgba(208,2,27,.35);
    }
    .social-btn:hover { background: #b8001a; box-shadow: 0 10px 32px rgba(208,2,27,.5); transform: translateY(-1px); }
    .edevlet-logo { display: flex; align-items: center; }
    .edevlet-logo img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }

    .register-footer { margin-top: 18px; text-align: center; font-size: 12px; color: rgba(200,230,210,.45); }
    .register-footer a { color: #3a9a58; text-decoration: none; font-weight: 500; margin-left: 4px; }
    .register-footer a:hover { color: #90d0a0; }

    .result-box {
      margin-top: 20px; padding: 14px; border-radius: 13px;
      background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.25);
      color: #90d0a0; font-size: 13px; line-height: 1.6;
    }

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
  usernameValid      = false;
  filteredDepartments: string[] = [];
  regFilteredUniversities: string[] = [];

  onRegCityChange(): void {
    this.registerUniversity = '';
    this.registerUniversityOther = '';
    this.registerFaculty = '';
    this.registerFacultyOther = '';
    this.registerDepartment = '';
    this.registerDepartmentOther = '';
    this.filteredDepartments = [];
    const city = this.registerCity === '__other__' ? '' : this.registerCity;
    this.regFilteredUniversities = this.universities
      .filter(u => u.city === city).map(u => u.name);
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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.splashEl = document.createElement('div');
    this.splashEl.innerHTML = `
      <div style="width:72px;height:72px;border-radius:22px;margin-bottom:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3a9a58,#1a5c30);box-shadow:0 0 40px rgba(58,154,88,.4)">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#90d0a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Mezun Portal\u0131</div>
      <div style="font-size:13px;color:rgba(200,230,210,.5);letter-spacing:.1em;margin-top:6px">Kariyer yolculu\u011funuza ho\u015f geldiniz</div>
      <div style="display:flex;gap:8px;margin-top:28px">
        <span style="width:8px;height:8px;border-radius:50%;background:#3a9a58;animation:spd 1.3s ease-in-out infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#90d0a0;animation:spd 1.3s ease-in-out .2s infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#a8c8e8;animation:spd 1.3s ease-in-out .4s infinite"></span>
      </div>
      <style>@keyframes spd{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.45)}}</style>
    `;
    Object.assign(this.splashEl.style, {
      position: 'fixed', inset: '0', zIndex: '99999',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, #061408 0%, #020608 100%)',
      transition: 'opacity 0.9s ease', opacity: '1'
    });
    document.body.appendChild(this.splashEl);
    setTimeout(() => { if (this.splashEl) this.splashEl.style.opacity = '0'; }, 2200);
    setTimeout(() => { if (this.splashEl) { this.splashEl.remove(); this.splashEl = null; } }, 3100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCanvas(), 50);
  }

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
    this.pts = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.4 + .3, a: Math.random() * .45 + .1, green: Math.random() > .7
    }));
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
          if (d < 110) {
            c.strokeStyle = `rgba(58,154,88,${.05*(1-d/110)})`; c.lineWidth = .5;
            c.beginPath(); c.moveTo(this.pts[i].x, this.pts[i].y); c.lineTo(this.pts[j].x, this.pts[j].y); c.stroke();
          }
        }
      }
      this.pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI*2);
        c.fillStyle = p.green ? `rgba(58,154,88,${p.a})` : `rgba(180,220,190,${p.a*.4})`; c.fill();
      });
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  setLang(l: 'tr' | 'en'): void { this.lang = l; }

  checkUsername(username: string): void {
    this.usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);
  }

  checkStrength(pw: string): void {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    this.strength = s;
    this.strengthClass = s <= 1 ? 'weak' : s <= 2 ? 'medium' : 'strong';
  }

  // ─── SADECE DEĞİŞEN METODLAR ────────────────────────────────────────────────
// Aşağıdaki iki metodu mevcut graduate-auth.page.ts içindeki
// login() ve register() metodlarıyla DEĞİŞTİR.
// Dosyanın geri kalanına (template, styles, canvas, vb.) dokunma.
// ─────────────────────────────────────────────────────────────────────────────

// ADIM 1: import satırlarına AuthService yanına HttpClient gerek yok,
//         AuthService zaten HttpClient kullanıyor. Sadece şunu kontrol et:
//         import { AuthService } from '../../services/auth.service';
//         — zaten var, tamam.

// ADIM 2: Bu iki metodu bul ve aşağıdakilerle değiştir:

  login(): void {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          // ✅ ÖNEMLİ: token kaydedilmeli
          this.authService.saveSession(res.token, res.role);
          this.authService.loginAs('GRADUATE');
          this.loginSuccess = true;
          this.message = 'Giriş başarılı. Yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/graduate']), 1200);
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
    const fullName = `${this.registerFirstName} ${this.registerLastName}`.trim();

    const universityName = this.registerUniversity === '__other__'
      ? this.registerUniversityOther
      : this.registerUniversity;

    const department = this.registerDepartment === '__other__'
      ? this.registerDepartmentOther
      : this.registerDepartment;

    this.authService.registerGraduate({
      fullName,
      username: this.registerUsername,
      email: this.registerEmail,
      universityName,
      department,
      studentNumber: this.registerStudentId,
      password: this.registerPassword
    }).subscribe({
      next: (res: any) => {
        if (res.status === 'SUCCESS') {
          this.registerSuccess = true;
          this.message = this.lang === 'tr'
            ? 'Kayıt başarılı! Giriş yapabilirsiniz.'
            : 'Registration complete. You can sign in.';
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

// ADIM 3: loginEdevlet() metodunu da güncelle (şimdilik placeholder kalabilir):
  loginEdevlet(): void {
    this.message = this.lang === 'tr'
      ? 'e-Devlet entegrasyonu yakında aktif olacak.'
      : 'eGov integration coming soon.';
  }

  goBack(): void { void this.router.navigate(['/login']); }

  readonly cities = [
    'Adana','Ad\u0131yaman','Afyonkarahisar','\u0100\u011fr\u0131','Aksaray','Amasya','Ankara','Antalya',
    'Ardahan','Artvin','Ayd\u0131n','Bal\u0131kesir','Bart\u0131n','Batman','Bayburt','Bilecik',
    'Bingöl','Bitlis','Bolu','Burdur','Bursa','\u00c7anakkale','\u00c7ank\u0131r\u0131','\u00c7orum',
    'Denizli','Diyarbak\u0131r','Düzce','Edirne','Elaz\u0131\u011f','Erzincan','Erzurum','Eskişehir',
    'Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','I\u011fd\u0131r','Isparta',
    '\u0130stanbul','\u0130zmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu',
    'Kayseri','Kilis','K\u0131r\u0131kkale','K\u0131rklareli','K\u0131rşehir','Kocaeli','Konya',
    'Kütahya','Malatya','Manisa','Mardin','Mersin','Mu\u011fla','Muş','Nevşehir',
    'Ni\u011fde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
    'Şanl\u0131urfa','Ş\u0131rnak','Tekirda\u011f','Tokat','Trabzon','Tunceli','Uşak','Van',
    'Yalova','Yozgat','Zonguldak'
  ];

  readonly universities: { name: string; city: string }[] = [
    {name:'Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi',city:'Adana'},
    {name:'Çukurova Üniversitesi',city:'Adana'},
    {name:'Adıyaman Üniversitesi',city:'Adıyaman'},
    {name:'Afyonkarahisar Sağlık Bilimleri Üniversitesi',city:'Afyonkarahisar'},
    {name:'Afyon Kocatepe Üniversitesi',city:'Afyonkarahisar'},
    {name:'Ağrı İbrahim Çeçen Üniversitesi',city:'Ağrı'},
    {name:'Aksaray Üniversitesi',city:'Aksaray'},
    {name:'Amasya Üniversitesi',city:'Amasya'},
    {name:'Ankara Üniversitesi',city:'Ankara'},{name:'Ankara Hacı Bayram Veli Üniversitesi',city:'Ankara'},
    {name:'Ankara Medipol Üniversitesi',city:'Ankara'},{name:'Ankara Müzik ve Güzel Sanatlar Üniversitesi',city:'Ankara'},
    {name:'Ankara Sosyal Bilimler Üniversitesi',city:'Ankara'},{name:'Ankara Yıldırım Beyazıt Üniversitesi',city:'Ankara'},
    {name:'Atılım Üniversitesi',city:'Ankara'},{name:'Başkent Üniversitesi',city:'Ankara'},
    {name:'Bilkent Üniversitesi',city:'Ankara'},{name:'Çankaya Üniversitesi',city:'Ankara'},
    {name:'Gazi Üniversitesi',city:'Ankara'},{name:'Hacettepe Üniversitesi',city:'Ankara'},
    {name:'Orta Doğu Teknik Üniversitesi',city:'Ankara'},{name:'Ostim Teknik Üniversitesi',city:'Ankara'},
    {name:'TED Üniversitesi',city:'Ankara'},{name:'TOBB Ekonomi ve Teknoloji Üniversitesi',city:'Ankara'},
    {name:'Türk Hava Kurumu Üniversitesi',city:'Ankara'},{name:'Ufuk Üniversitesi',city:'Ankara'},
    {name:'Akdeniz Üniversitesi',city:'Antalya'},{name:'Alanya Alaaddin Keykubat Üniversitesi',city:'Antalya'},
    {name:'Alanya HEP Üniversitesi',city:'Antalya'},{name:'Antalya Bilim Üniversitesi',city:'Antalya'},
    {name:'Ardahan Üniversitesi',city:'Ardahan'},{name:'Artvin Çoruh Üniversitesi',city:'Artvin'},
    {name:'Aydın Adnan Menderes Üniversitesi',city:'Aydın'},
    {name:'Balıkesir Üniversitesi',city:'Balıkesir'},{name:'Bandırma Onyedi Eylül Üniversitesi',city:'Balıkesir'},
    {name:'Bartın Üniversitesi',city:'Bartın'},{name:'Batman Üniversitesi',city:'Batman'},
    {name:'Bayburt Üniversitesi',city:'Bayburt'},{name:'Bilecik Şeyh Edebali Üniversitesi',city:'Bilecik'},
    {name:'Bingöl Üniversitesi',city:'Bingöl'},{name:'Bitlis Eren Üniversitesi',city:'Bitlis'},
    {name:'Bolu Abant İzzet Baysal Üniversitesi',city:'Bolu'},{name:'Mehmet Akif Ersoy Üniversitesi',city:'Burdur'},
    {name:'Bursa Teknik Üniversitesi',city:'Bursa'},{name:'Bursa Uludağ Üniversitesi',city:'Bursa'},
    {name:'Çanakkale Onsekiz Mart Üniversitesi',city:'Çanakkale'},{name:'Çankırı Karatekin Üniversitesi',city:'Çankırı'},
    {name:'Hitit Üniversitesi',city:'Çorum'},{name:'Pamukkale Üniversitesi',city:'Denizli'},
    {name:'Dicle Üniversitesi',city:'Diyarbakır'},{name:'Düzce Üniversitesi',city:'Düzce'},
    {name:'Trakya Üniversitesi',city:'Edirne'},{name:'Fırat Üniversitesi',city:'Elazığ'},
    {name:'Erzincan Binali Yıldırım Üniversitesi',city:'Erzincan'},
    {name:'Atatürk Üniversitesi',city:'Erzurum'},{name:'Erzurum Teknik Üniversitesi',city:'Erzurum'},
    {name:'Anadolu Üniversitesi',city:'Eskişehir'},{name:'Eskişehir Osmangazi Üniversitesi',city:'Eskişehir'},
    {name:'Eskişehir Teknik Üniversitesi',city:'Eskişehir'},
    {name:'Gaziantep İslam Bilim ve Teknoloji Üniversitesi',city:'Gaziantep'},
    {name:'Gaziantep Üniversitesi',city:'Gaziantep'},{name:'Hasan Kalyoncu Üniversitesi',city:'Gaziantep'},
    {name:'Sanko Üniversitesi',city:'Gaziantep'},{name:'Giresun Üniversitesi',city:'Giresun'},
    {name:'Gümüşhane Üniversitesi',city:'Gümüşhane'},{name:'Hakkari Üniversitesi',city:'Hakkari'},
    {name:'Hatay Mustafa Kemal Üniversitesi',city:'Hatay'},{name:'İskenderun Teknik Üniversitesi',city:'Hatay'},
    {name:'Iğdır Üniversitesi',city:'Iğdır'},{name:'Isparta Uygulamalı Bilimler Üniversitesi',city:'Isparta'},
    {name:'Süleyman Demirel Üniversitesi',city:'Isparta'},
    {name:'Altınbaş Üniversitesi',city:'İstanbul'},{name:'Bahçeşehir Üniversitesi',city:'İstanbul'},
    {name:'Beykent Üniversitesi',city:'İstanbul'},{name:'Beykoz Üniversitesi',city:'İstanbul'},
    {name:'Boğaziçi Üniversitesi',city:'İstanbul'},{name:'Fatih Sultan Mehmet Vakıf Üniversitesi',city:'İstanbul'},
    {name:'Galatasaray Üniversitesi',city:'İstanbul'},{name:'Haliç Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Arel Üniversitesi',city:'İstanbul'},{name:'İstanbul Aydın Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Bilgi Üniversitesi',city:'İstanbul'},{name:'İstanbul Esenyurt Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Gedik Üniversitesi',city:'İstanbul'},{name:'İstanbul Kültür Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Medeniyet Üniversitesi',city:'İstanbul'},{name:'İstanbul Medipol Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Okan Üniversitesi',city:'İstanbul'},{name:'İstanbul Sabahattin Zaim Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Teknik Üniversitesi',city:'İstanbul'},{name:'İstanbul Ticaret Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Topkapı Üniversitesi',city:'İstanbul'},{name:'İstanbul Üniversitesi',city:'İstanbul'},
    {name:'İstanbul Üniversitesi-Cerrahpaşa',city:'İstanbul'},{name:'İstanbul 29 Mayıs Üniversitesi',city:'İstanbul'},
    {name:'Işık Üniversitesi',city:'İstanbul'},{name:'Kadir Has Üniversitesi',city:'İstanbul'},
    {name:'Koç Üniversitesi',city:'İstanbul'},{name:'Maltepe Üniversitesi',city:'İstanbul'},
    {name:'Marmara Üniversitesi',city:'İstanbul'},{name:'Mef Üniversitesi',city:'İstanbul'},
    {name:'Mimar Sinan Güzel Sanatlar Üniversitesi',city:'İstanbul'},{name:'Nişantaşı Üniversitesi',city:'İstanbul'},
    {name:'Özyeğin Üniversitesi',city:'İstanbul'},{name:'Piri Reis Üniversitesi',city:'İstanbul'},
    {name:'Sabancı Üniversitesi',city:'İstanbul'},{name:'Türk-Alman Üniversitesi',city:'İstanbul'},
    {name:'Üsküdar Üniversitesi',city:'İstanbul'},{name:'Yeditepe Üniversitesi',city:'İstanbul'},
    {name:'Yıldız Teknik Üniversitesi',city:'İstanbul'},
    {name:'Dokuz Eylül Üniversitesi',city:'İzmir'},{name:'Ege Üniversitesi',city:'İzmir'},
    {name:'İzmir Bakırçay Üniversitesi',city:'İzmir'},{name:'İzmir Demokrasi Üniversitesi',city:'İzmir'},
    {name:'İzmir Ekonomi Üniversitesi',city:'İzmir'},{name:'İzmir Kâtip Çelebi Üniversitesi',city:'İzmir'},
    {name:'İzmir Tınaztepe Üniversitesi',city:'İzmir'},{name:'Yaşar Üniversitesi',city:'İzmir'},
    {name:'Kahramanmaraş İstiklal Üniversitesi',city:'Kahramanmaraş'},{name:'Kahramanmaraş Sütçü İmam Üniversitesi',city:'Kahramanmaraş'},
    {name:'Karabük Üniversitesi',city:'Karabük'},{name:'Karaman Mehmetbey Üniversitesi',city:'Karaman'},
    {name:'Kafkas Üniversitesi',city:'Kars'},{name:'Kastamonu Üniversitesi',city:'Kastamonu'},
    {name:'Abdullah Gül Üniversitesi',city:'Kayseri'},{name:'Erciyes Üniversitesi',city:'Kayseri'},
    {name:'Nuh Naci Yazgan Üniversitesi',city:'Kayseri'},{name:'Kilis 7 Aralık Üniversitesi',city:'Kilis'},
    {name:'Kırıkkale Üniversitesi',city:'Kırıkkale'},{name:'Kırklareli Üniversitesi',city:'Kırklareli'},
    {name:'Kırşehir Ahi Evran Üniversitesi',city:'Kırşehir'},{name:'Gebze Teknik Üniversitesi',city:'Kocaeli'},
    {name:'Kocaeli Üniversitesi',city:'Kocaeli'},{name:'Konya Teknik Üniversitesi',city:'Konya'},
    {name:'KTO Karatay Üniversitesi',city:'Konya'},{name:'Necmettin Erbakan Üniversitesi',city:'Konya'},
    {name:'Selçuk Üniversitesi',city:'Konya'},{name:'Kütahya Dumlupınar Üniversitesi',city:'Kütahya'},
    {name:'Kütahya Sağlık Bilimleri Üniversitesi',city:'Kütahya'},
    {name:'İnönü Üniversitesi',city:'Malatya'},{name:'Malatya Turgut Özal Üniversitesi',city:'Malatya'},
    {name:'Manisa Celal Bayar Üniversitesi',city:'Manisa'},{name:'Mardin Artuklu Üniversitesi',city:'Mardin'},
    {name:'Mersin Üniversitesi',city:'Mersin'},{name:'Toros Üniversitesi',city:'Mersin'},
    {name:'Muğla Sıtkı Koçman Üniversitesi',city:'Muğla'},{name:'Muş Alparslan Üniversitesi',city:'Muş'},
    {name:'Nevşehir Hacı Bektaş Veli Üniversitesi',city:'Nevşehir'},
    {name:'Niğde Ömer Halisdemir Üniversitesi',city:'Niğde'},{name:'Ordu Üniversitesi',city:'Ordu'},
    {name:'Osmaniye Korkut Ata Üniversitesi',city:'Osmaniye'},{name:'Recep Tayyip Erdoğan Üniversitesi',city:'Rize'},
    {name:'Sakarya Uygulamalı Bilimler Üniversitesi',city:'Sakarya'},{name:'Sakarya Üniversitesi',city:'Sakarya'},
    {name:'Ondokuz Mayıs Üniversitesi',city:'Samsun'},{name:'Samsun Üniversitesi',city:'Samsun'},
    {name:'Siirt Üniversitesi',city:'Siirt'},{name:'Sinop Üniversitesi',city:'Sinop'},
    {name:'Sivas Bilim ve Teknoloji Üniversitesi',city:'Sivas'},{name:'Sivas Cumhuriyet Üniversitesi',city:'Sivas'},
    {name:'Harran Üniversitesi',city:'Şanlıurfa'},{name:'Şırnak Üniversitesi',city:'Şırnak'},
    {name:'Tekirdağ Namık Kemal Üniversitesi',city:'Tekirdağ'},{name:'Tokat Gaziosmanpaşa Üniversitesi',city:'Tokat'},
    {name:'Karadeniz Teknik Üniversitesi',city:'Trabzon'},{name:'Trabzon Üniversitesi',city:'Trabzon'},
    {name:'Munzur Üniversitesi',city:'Tunceli'},{name:'Uşak Üniversitesi',city:'Uşak'},
    {name:'Van Yüzüncü Yıl Üniversitesi',city:'Van'},{name:'Yalova Üniversitesi',city:'Yalova'},
    {name:'Yozgat Bozok Üniversitesi',city:'Yozgat'},{name:'Zonguldak Bülent Ecevit Üniversitesi',city:'Zonguldak'},
  ];
}
