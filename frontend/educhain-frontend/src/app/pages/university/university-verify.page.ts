import { Component, ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

type VerifyStatus = 'VALID' | 'INVALID';

@Component({
  standalone: true,
  selector: 'app-university-verify',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <canvas id="bg-canvas-uv"></canvas>
      <div class="grid-overlay"></div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <button class="logout-btn" (click)="logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Çıkış Yap
      </button>

      <div class="wrapper">
        <div class="card">

          <div class="card-header">
            <div class="emblem">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="card-title">Diploma Doğrulama</h1>
            <p class="card-sub">Sertifika geçerlilik kontrol sistemi</p>
          </div>

          <!-- CÜZDAN -->
          <div class="wallet-box">
            <div class="wallet-head">
              <div>
                <div class="wallet-kicker">BLOKZİNCİR KİMLİĞİ</div>
                <div class="wallet-title">Üniversite Cüzdanı</div>
              </div>

              <div class="wallet-pill" [class.connected]="walletVerified">
                <span class="wallet-dot"></span>
                {{ walletVerified ? 'Bağlı' : 'Bağlı değil' }}
              </div>
            </div>

            <div class="wallet-address" *ngIf="walletAddress; else noWalletAddress">
              {{ walletAddress }}
            </div>

            <ng-template #noWalletAddress>
              <div class="wallet-address empty">
                Henüz bir cüzdan bağlanmadı.
              </div>
            </ng-template>

            <button type="button" class="wallet-btn" [disabled]="walletBusy" (click)="connectWallet()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V8h1.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H19v.5A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5v-9Z"/>
                <circle cx="17" cy="12" r="1.1"/>
              </svg>
              {{ walletBusy ? 'Bağlanıyor...' : 'MetaMask Bağla' }}
            </button>

            <p class="wallet-msg" *ngIf="walletMessage">{{ walletMessage }}</p>
            <p class="wallet-note" *ngIf="!walletMessage">
              Üniversite hesabını yetkili cüzdan ile eşleştirmek için bu alan kullanılacak.
            </p>
          </div>

          <!-- PDF -->
          <div class="field">
            <label class="fl">DİPLOMA / SERTİFİKA PDF</label>
            <div class="file-wrap" [class.has-file]="selectedFile">
              <input type="file" accept="application/pdf" (change)="onFileSelected($event)" id="pdf-input-uv" />
              <label for="pdf-input-uv" class="file-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 16l4-4 4 4 4-8 4 8"/>
                  <rect x="2" y="2" width="20" height="20" rx="2"/>
                </svg>
                <span>{{ selectedFile ? selectedFile.name : 'PDF dosyası seçiniz' }}</span>
              </label>
            </div>
            <p class="hint">Doğrulamak istediğiniz PDF dosyasını seçiniz.</p>
          </div>

          <!-- ÜNİVERSİTE -->
          <div class="field">
            <label class="fl">ÜNİVERSİTE</label>
            <div class="fw">
              <select [(ngModel)]="universityName" (change)="onUniversityChange()">
                <option value="">Üniversite seçiniz</option>
                <option *ngFor="let u of allUniversities" [value]="u">{{ u }}</option>
                <option value="__other__">Diğer</option>
              </select>
            </div>
            <div class="fw other-input" *ngIf="universityName === '__other__'">
              <input type="text" [(ngModel)]="universityNameOther" placeholder="Üniversite adını giriniz" />
            </div>
            <p class="hint">Mezunun kayıtlı olduğu üniversiteyi seçiniz.</p>
          </div>

          <!-- BÖLÜM -->
          <div class="field">
            <label class="fl">BÖLÜM</label>
            <div class="fw">
              <select [(ngModel)]="department" [disabled]="!universityName">
                <option value="">{{ !universityName ? 'Önce üniversite seçiniz' : 'Bölüm seçiniz' }}</option>
                <option *ngFor="let d of filteredDepartments" [value]="d">{{ d }}</option>
                <option value="__other__">Diğer</option>
              </select>
            </div>
            <div class="fw other-input" *ngIf="department === '__other__'">
              <input type="text" [(ngModel)]="departmentOther" placeholder="Bölüm adını giriniz" />
            </div>
            <p class="hint">Seçilen üniversiteye ait bölümü seçiniz.</p>
          </div>

          <!-- ÖĞRENCİ NO -->
          <div class="field">
            <label class="fl">ÖĞRENCİ NUMARASI</label>
            <div class="fw">
              <input type="text" [(ngModel)]="studentNumber" placeholder="Örn: 220303014" />
            </div>
            <p class="hint">Doğrulama işlemi öğrenci numarası üzerinden yapılır.</p>
          </div>

          <button
            class="verify-btn"
            [disabled]="loading || !selectedFile || !universityName || !department || !studentNumber"
            (click)="verify()"
          >
            <svg *ngIf="!loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? 'Doğrulanıyor...' : 'DOĞRULA' }}
          </button>

          <div *ngIf="status && !loading" class="result">
            <div class="badge valid" *ngIf="status === 'VALID'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <div class="badge-title">Sertifika GEÇERLİ</div>
                <div class="badge-msg">{{ resultMessage }}</div>
              </div>
            </div>

            <div class="badge invalid" *ngIf="status === 'INVALID'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <div class="badge-title">Sertifika GEÇERSİZ</div>
                <div class="badge-msg">{{ resultMessage }}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 80px 24px 24px;
      font-family: 'DM Sans','Inter',system-ui,sans-serif;
      color: #e8e4d8;
    }

    #bg-canvas-uv { position: fixed; inset: 0; z-index: 0; }

    .grid-overlay {
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(201,168,76,.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,168,76,.035) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 1;
      pointer-events: none;
      animation: blobFloat linear infinite;
    }

    .blob-1 {
      width: 500px;
      height: 500px;
      background: #1a3a6e;
      top: -150px;
      left: -150px;
      opacity: .3;
      animation-duration: 14s;
    }

    .blob-2 {
      width: 450px;
      height: 450px;
      background: #0a2a5e;
      bottom: -100px;
      right: -100px;
      opacity: .28;
      animation-duration: 17s;
      animation-delay: -6s;
    }

    .blob-3 {
      width: 280px;
      height: 280px;
      background: rgba(201,168,76,.12);
      top: 50%;
      left: 50%;
      opacity: .35;
      animation-duration: 11s;
      animation-delay: -3s;
    }

    @keyframes blobFloat {
      0% { transform: translate(0,0) scale(1); }
      33% { transform: translate(25px,-35px) scale(1.06); }
      66% { transform: translate(-18px,18px) scale(.95); }
      100% { transform: translate(0,0) scale(1); }
    }

    .logout-btn {
      position: fixed;
      top: 20px;
      right: 24px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      background: rgba(10,20,40,.7);
      border: 1px solid rgba(201,168,76,.22);
      border-radius: 100px;
      color: rgba(232,228,216,.5);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      backdrop-filter: blur(14px);
      transition: all .25s;
      font-family: 'DM Sans','Inter',sans-serif;
    }

    .logout-btn:hover {
      background: rgba(220,40,40,.15);
      border-color: #e05252;
      color: #ff9090;
    }

    .logout-btn svg {
      width: 14px;
      height: 14px;
    }

    .wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      width: 100%;
      max-width: 520px;
      background: rgba(10,20,40,0.82);
      border: 1px solid rgba(201,168,76,.22);
      border-radius: 26px;
      padding: 48px 44px 42px;
      backdrop-filter: blur(24px);
      box-shadow:
        0 0 0 1px rgba(201,168,76,.07),
        0 40px 80px rgba(0,0,0,.65),
        inset 0 1px 0 rgba(255,255,255,.05);
      animation: cardIn .8s .1s cubic-bezier(.16,1,.3,1) both;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px) scale(.97); }
      to { opacity: 1; transform: none; }
    }

    .card-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .emblem {
      width: 62px;
      height: 62px;
      border-radius: 18px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #c9a84c 0%, #7a5a1a 100%);
      box-shadow: 0 8px 28px rgba(201,168,76,.35);
    }

    .emblem svg {
      width: 30px;
      height: 30px;
    }

    .card-title {
      font-family: 'Cormorant Garamond',Georgia,serif;
      font-size: 27px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff, #e8c97a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-sub {
      font-size: 13px;
      color: rgba(232,228,216,.45);
      margin-top: 5px;
      font-weight: 300;
      letter-spacing: .04em;
    }

    .wallet-box {
      margin-bottom: 22px;
      padding: 18px;
      border-radius: 18px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(201,168,76,.18);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.03);
    }

    .wallet-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .wallet-kicker {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .12em;
      color: #c9a84c;
      margin-bottom: 4px;
    }

    .wallet-title {
      font-size: 16px;
      font-weight: 600;
      color: #f4efe2;
    }

    .wallet-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(239,68,68,.12);
      border: 1px solid rgba(239,68,68,.24);
      color: #f2a2a2;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .wallet-pill.connected {
      background: rgba(34,197,94,.12);
      border-color: rgba(34,197,94,.24);
      color: #7add9b;
    }

    .wallet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 4px rgba(255,255,255,.04);
    }

    .wallet-address {
      width: 100%;
      margin-bottom: 14px;
      padding: 13px 14px;
      border-radius: 13px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      font-size: 13px;
      line-height: 1.5;
      color: rgba(232,228,216,.88);
      word-break: break-all;
    }

    .wallet-address.empty {
      color: rgba(232,228,216,.42);
    }

    .wallet-btn {
      width: 100%;
      padding: 13px 14px;
      border: 1px solid rgba(201,168,76,.28);
      border-radius: 13px;
      background: linear-gradient(135deg, rgba(201,168,76,.14), rgba(58,95,214,.12));
      color: #f3e7c1;
      font-family: 'DM Sans','Inter',sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .04em;
      cursor: pointer;
      transition: all .3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
    }

    .wallet-btn svg {
      width: 17px;
      height: 17px;
    }

    .wallet-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: rgba(201,168,76,.48);
      box-shadow: 0 10px 26px rgba(0,0,0,.18);
    }

    .wallet-btn:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .wallet-msg,
    .wallet-note {
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.5;
    }

    .wallet-msg {
      color: #e8c97a;
    }

    .wallet-note {
      color: rgba(232,228,216,.42);
    }

    .field {
      margin-bottom: 20px;
    }

    .fl {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .09em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 7px;
    }

    .fw {
      position: relative;
      display: flex;
      align-items: center;
    }

    input[type=text], select {
      width: 100%;
      padding: 13px 16px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 13px;
      color: #e8e4d8;
      font-family: 'DM Sans','Inter',sans-serif;
      font-size: 14px;
      font-weight: 300;
      outline: none;
      transition: all .3s;
      appearance: none;
    }

    input:focus, select:focus {
      border-color: rgba(201,168,76,.5);
      background: rgba(201,168,76,.06);
      box-shadow: 0 0 0 3px rgba(201,168,76,.1);
    }

    select:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    select option {
      background: #0d1829;
      color: #e8e4d8;
    }

    input::placeholder {
      color: rgba(232,228,216,.25);
    }

    .other-input {
      margin-top: 8px;
    }

    .hint {
      margin-top: 7px;
      font-size: 11.5px;
      color: rgba(232,228,216,.35);
    }

    .file-wrap {
      position: relative;
    }

    .file-wrap input[type=file] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(255,255,255,.05);
      border: 1px dashed rgba(201,168,76,.3);
      border-radius: 13px;
      cursor: pointer;
      transition: all .3s;
      font-size: 14px;
      color: rgba(232,228,216,.5);
    }

    .file-label svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .file-wrap:hover .file-label,
    .file-wrap.has-file .file-label {
      border-color: rgba(201,168,76,.6);
      background: rgba(201,168,76,.06);
      color: #e8c97a;
    }

    .verify-btn {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 13px;
      font-family: 'DM Sans','Inter',sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: .07em;
      cursor: pointer;
      background: linear-gradient(135deg, #1a3a8a 0%, #3a5fd6 55%, #c9a84c 100%);
      background-size: 200%;
      color: #fff;
      transition: all .4s;
      box-shadow: 0 8px 24px rgba(26,58,138,.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }

    .verify-btn svg {
      width: 18px;
      height: 18px;
    }

    .verify-btn:hover:not(:disabled) {
      background-position: 100%;
      box-shadow: 0 12px 32px rgba(26,58,138,.6);
      transform: translateY(-1px);
    }

    .verify-btn:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none !important;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .result {
      margin-top: 22px;
      animation: fadeUp .4s both;
    }

    .badge {
      padding: 16px 18px;
      border-radius: 14px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .badge svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .badge.valid {
      background: rgba(34,197,94,.12);
      border: 1px solid rgba(34,197,94,.3);
      color: #52c97a;
    }

    .badge.invalid {
      background: rgba(239,68,68,.12);
      border: 1px solid rgba(239,68,68,.3);
      color: #e05252;
    }

    .badge-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .badge-msg {
      font-size: 13px;
      color: rgba(240,240,240,.7);
      font-weight: 400;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: none; }
    }
  `]
})
export class UniversityVerifyPage implements OnInit, AfterViewInit, OnDestroy {

  selectedFile: File | null = null;
  universityName = '';
  universityNameOther = '';
  department = '';
  departmentOther = '';
  studentNumber = '';
  filteredDepartments: string[] = [];
  loading = false;
  status: VerifyStatus | null = null;
  resultMessage = '';

  walletAddress = '';
  walletVerified = false;
  walletBusy = false;
  walletMessage = '';

  readonly faculties: { name: string; departments: string[] }[] = [
    { name: 'Mühendislik Fakültesi', departments: ['Bilgisayar Mühendisliği','Yazılım Mühendisliği','Elektrik-Elektronik Mühendisliği','Makine Mühendisliği','İnşaat Mühendisliği','Endüstri Mühendisliği','Kimya Mühendisliği','Biyomedikal Mühendisliği','Çevre Mühendisliği','Gıda Mühendisliği','Mekatronik Mühendisliği'] },
    { name: 'Tıp Fakültesi', departments: ['Tıp (İngilizce)','Tıp (Türkçe)'] },
    { name: 'Hukuk Fakültesi', departments: ['Hukuk'] },
    { name: 'İktisadi ve İdari Bilimler Fakültesi', departments: ['İktisat','İşletme','Kamu Yönetimi','Uluslararası İlişkiler','Maliye','Ekonometri','Yönetim Bilişim Sistemleri','Sağlık Yönetimi','Bankacılık ve Finans','Lojistik Yönetimi'] },
    { name: 'Fen-Edebiyat Fakültesi', departments: ['Matematik','Fizik','Kimya','Biyoloji','İstatistik','Türk Dili ve Edebiyatı','Tarih','Coğrafya','Felsefe','Sosyoloji','Psikoloji','Moleküler Biyoloji ve Genetik'] },
    { name: 'Eğitim Fakültesi', departments: ['Okul Öncesi Öğretmenliği','Sınıf Öğretmenliği','Fen Bilgisi Öğretmenliği','Matematik Öğretmenliği','Türkçe Öğretmenliği','İngilizce Öğretmenliği','Rehberlik ve Psikolojik Danışmanlık','Bilgisayar ve Öğretim Teknolojileri'] },
    { name: 'Mimarlık Fakültesi', departments: ['Mimarlık','İç Mimarlık','Peyzaj Mimarlığı','Şehir ve Bölge Planlama','Endüstriyel Tasarım','Grafik Tasarım'] },
    { name: 'Güzel Sanatlar Fakültesi', departments: ['Resim','Heykel','Seramik','Grafik Tasarım','Sinema-Televizyon','Fotoğraf ve Video'] },
    { name: 'İletişim Fakültesi', departments: ['Gazetecilik','Radyo Televizyon ve Sinema','Halkla İlişkiler ve Reklamcılık','Yeni Medya'] },
    { name: 'Sağlık Bilimleri Fakültesi', departments: ['Hemşirelik','Ebelik','Fizyoterapi ve Rehabilitasyon','Beslenme ve Diyetetik','Sosyal Hizmet','Ergoterapi'] },
    { name: 'Diş Hekimliği Fakültesi', departments: ['Diş Hekimliği'] },
    { name: 'Eczacılık Fakültesi', departments: ['Eczacılık'] },
    { name: 'Veteriner Fakültesi', departments: ['Veterinerlik'] },
    { name: 'Ziraat Fakültesi', departments: ['Ziraat Mühendisliği','Bahçe Bitkileri','Tarla Bitkileri','Toprak Bilimi ve Bitki Besleme','Bitki Koruma','Tarım Ekonomisi','Zootekni'] },
    { name: 'Spor Bilimleri Fakültesi', departments: ['Beden Eğitimi ve Spor Öğretmenliği','Spor Yöneticiliği','Antrenörlük Eğitimi','Rekreasyon'] },
    { name: 'İlahiyat Fakültesi', departments: ['İlahiyat','İslami İlimler'] },
    { name: 'Turizm Fakültesi', departments: ['Turizm İşletmeciliği','Otel Yöneticiliği','Rehberlik','Gastronomi ve Mutfak Sanatları'] },
  ];

  readonly allUniversities: string[] = [
    'Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi','Çukurova Üniversitesi','Ankara Üniversitesi','Ankara Hacı Bayram Veli Üniversitesi',
    'Atılım Üniversitesi','Başkent Üniversitesi','Bilkent Üniversitesi','Çankaya Üniversitesi','Gazi Üniversitesi','Hacettepe Üniversitesi',
    'Orta Doğu Teknik Üniversitesi','TOBB Ekonomi ve Teknoloji Üniversitesi','Akdeniz Üniversitesi','Alanya Alaaddin Keykubat Üniversitesi',
    'Atatürk Üniversitesi','Erzurum Teknik Üniversitesi','Anadolu Üniversitesi','Eskişehir Osmangazi Üniversitesi','Eskişehir Teknik Üniversitesi',
    'Gaziantep Üniversitesi','Hasan Kalyoncu Üniversitesi','Bahçeşehir Üniversitesi','Beykent Üniversitesi','Boğaziçi Üniversitesi',
    'Fatih Sultan Mehmet Vakıf Üniversitesi','Galatasaray Üniversitesi','İstanbul Bilgi Üniversitesi','İstanbul Kültür Üniversitesi',
    'İstanbul Medeniyet Üniversitesi','İstanbul Medipol Üniversitesi','İstanbul Teknik Üniversitesi','İstanbul Üniversitesi',
    'İstanbul Üniversitesi-Cerrahpaşa','Kadir Has Üniversitesi','Koç Üniversitesi','Maltepe Üniversitesi','Marmara Üniversitesi',
    'Mimar Sinan Güzel Sanatlar Üniversitesi','Özyeğin Üniversitesi','Sabancı Üniversitesi','Yeditepe Üniversitesi','Yıldız Teknik Üniversitesi',
    'Dokuz Eylül Üniversitesi','Ege Üniversitesi','İzmir Ekonomi Üniversitesi','İzmir Kâtip Çelebi Üniversitesi','Yaşar Üniversitesi',
    'Erciyes Üniversitesi','Selçuk Üniversitesi','Necmettin Erbakan Üniversitesi','Konya Teknik Üniversitesi',
    'Bursa Uludağ Üniversitesi','Bursa Teknik Üniversitesi','Kocaeli Üniversitesi','Gebze Teknik Üniversitesi',
    'Karadeniz Teknik Üniversitesi','Ondokuz Mayıs Üniversitesi','Fırat Üniversitesi','Dicle Üniversitesi',
    'Pamukkale Üniversitesi','Muğla Sıtkı Koçman Üniversitesi','Mersin Üniversitesi','Çanakkale Onsekiz Mart Üniversitesi',
    'Trakya Üniversitesi','Sakarya Üniversitesi','Düzce Üniversitesi','Bolu Abant İzzet Baysal Üniversitesi',
    'Süleyman Demirel Üniversitesi','Mehmet Akif Ersoy Üniversitesi','Harran Üniversitesi','Tokat Gaziosmanpaşa Üniversitesi',
  ];

  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private pts: any[] = [];
  private animId?: number;
  private resizeHandler?: () => void;
  private splashEl: HTMLElement | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.splashEl = document.createElement('div');
    this.splashEl.innerHTML = `
      <div style="width:72px;height:72px;border-radius:22px;margin-bottom:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#c9a84c,#7a5a1a);box-shadow:0 0 40px rgba(201,168,76,.4)">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#e8c97a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
        Diploma Doğrulama
      </div>
      <div style="font-size:13px;color:rgba(232,228,216,.5);letter-spacing:.1em;margin-top:6px">
        Sertifika geçerlilik kontrol sistemi
      </div>
      <div style="display:flex;gap:8px;margin-top:28px">
        <span style="width:8px;height:8px;border-radius:50%;background:#c9a84c;animation:spd 1.3s ease-in-out infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#e8c97a;animation:spd 1.3s ease-in-out .2s infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#a8c8e8;animation:spd 1.3s ease-in-out .4s infinite"></span>
      </div>
      <style>
        @keyframes spd {
          0%,100% { opacity:.35; transform:scale(1); }
          50% { opacity:1; transform:scale(1.45); }
        }
      </style>
    `;

    Object.assign(this.splashEl.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '99999',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, #0d1829 0%, #020608 100%)',
      transition: 'opacity 0.9s ease',
      opacity: '1'
    });

    document.body.appendChild(this.splashEl);

    setTimeout(() => {
      if (this.splashEl) this.splashEl.style.opacity = '0';
    }, 2200);

    setTimeout(() => {
      if (this.splashEl) {
        this.splashEl.remove();
        this.splashEl = null;
      }
    }, 3100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCanvas(), 50);
  }

  ngOnDestroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.splashEl) {
      this.splashEl.remove();
      this.splashEl = null;
    }
  }

  private initCanvas(): void {
    this.canvas = document.getElementById('bg-canvas-uv') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d')!;
    this.resizeHandler = () => {
      this.canvas!.width = window.innerWidth;
      this.canvas!.height = window.innerHeight;
    };

    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);

    this.pts = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.45 + 0.1,
      gold: Math.random() > 0.8
    }));

    const loop = () => {
      const W = this.canvas!.width;
      const H = this.canvas!.height;
      const c = this.ctx!;

      c.clearRect(0, 0, W, H);

      const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, '#0d1829');
      g.addColorStop(1, '#020608');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);

      for (let i = 0; i < this.pts.length; i++) {
        for (let j = i + 1; j < this.pts.length; j++) {
          const dx = this.pts[i].x - this.pts[j].x;
          const dy = this.pts[i].y - this.pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 110) {
            c.strokeStyle = `rgba(201,168,76,${0.055 * (1 - d / 110)})`;
            c.lineWidth = 0.5;
            c.beginPath();
            c.moveTo(this.pts[i].x, this.pts[i].y);
            c.lineTo(this.pts[j].x, this.pts[j].y);
            c.stroke();
          }
        }
      }

      this.pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = p.gold
          ? `rgba(201,168,76,${p.a})`
          : `rgba(180,200,255,${p.a * 0.5})`;
        c.fill();
      });

      this.animId = requestAnimationFrame(loop);
    };

    loop();
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
    this.cdr.detectChanges();
  }

  onUniversityChange(): void {
    this.department = '';
    this.departmentOther = '';
    this.universityNameOther = '';
    this.filteredDepartments = this.faculties.flatMap(f => f.departments);
    this.cdr.detectChanges();
  }

  async connectWallet(): Promise<void> {
    const ethereum = (window as any)?.ethereum;

    if (!ethereum) {
      this.walletVerified = false;
      this.walletMessage = 'MetaMask bulunamadı. Lütfen tarayıcınıza MetaMask yükleyin.';
      this.cdr.detectChanges();
      return;
    }

    this.walletBusy = true;
    this.walletMessage = '';
    this.cdr.detectChanges();

    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      await this.ensureSepolia(ethereum);

      const accounts: string[] = await ethereum.request({ method: 'eth_accounts' });

      if (!accounts || accounts.length === 0) {
        throw new Error('MetaMask hesabı alınamadı.');
      }

      const address = accounts[0];

      const UNIVERSITY_WALLET = '0x5DBB002c51869A32d69Df249B692Cde533131056';

      if (address.toLowerCase() !== UNIVERSITY_WALLET.toLowerCase()) {
        throw new Error('Üniversite portalı için MetaMask’ta üniversite hesabı seçili olmalı.');
      }

      const challengeRes: any = await this.auth.getWalletChallenge().toPromise();

      if (!challengeRes?.message) {
        throw new Error('Challenge mesajı alınamadı.');
      }

      const signature: string = await ethereum.request({
        method: 'personal_sign',
        params: [challengeRes.message, address]
      });

      const verifyRes: any = await this.auth.verifyWalletSignature({
        walletAddress: address,
        message: challengeRes.message,
        signature
      }).toPromise();

      this.walletAddress = verifyRes?.walletAddress || address;
      this.walletVerified = true;
      this.walletMessage = 'MetaMask başarıyla bağlandı ve doğrulandı.';
    } catch (error: any) {
      this.walletVerified = false;
      this.walletMessage =
        error?.message ||
        'MetaMask bağlantısı sırasında bir hata oluştu.';
    } finally {
      this.walletBusy = false;
      this.cdr.detectChanges();
    }
  }

  async ensureSepolia(ethereum: any): Promise<void> {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }]
      });
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/9c3cc6097ce842baac531f8133648a29'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  verify(): void {
    const uniName = this.universityName === '__other__' ? this.universityNameOther : this.universityName;
    const deptName = this.department === '__other__' ? this.departmentOther : this.department;

    if (!this.selectedFile || !uniName || !deptName || !this.studentNumber) return;

    this.loading = true;
    this.status = null;
    this.resultMessage = '';

    this.apiService.verifyCertificatePdf(
      this.selectedFile,
      uniName,
      deptName,
      this.studentNumber
    ).subscribe({
      next: (res: any) => {
        if (res.status && res.status.startsWith('GEÇERLİ')) {
          this.status = 'VALID';
          this.resultMessage = 'Diploma blockchain üzerinde doğrulandı.';
        } else {
          this.status = 'INVALID';
          this.resultMessage = res.status ?? 'Diploma doğrulanamadı.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.status = 'INVALID';
        this.resultMessage = 'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
