import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

        <!-- ORBLAR – 3 ADET -->
        <div class="orb orb-top-left"></div>
        <div class="orb orb-top-right"></div>
        <div class="orb orb-bottom-center"></div>

        <div class="eyes" [class.focused]="passwordFocused">
          <span class="eye"></span>
          <span class="eye"></span>
        </div>

        <div class="card">
          <h2>Giriş</h2>

          <label>E-posta</label>
          <input [(ngModel)]="email" (focus)="passwordFocused=false"/>

          <label>Şifre</label>
          <input type="password" [(ngModel)]="password" (focus)="passwordFocused=true"/>

          <button (click)="login()">Giriş Yap</button>

          <div class="links">
            <span>Şifremi unuttum</span>
            <span>Kayıt Ol</span>
          </div>
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
    }

    .top-title {
      position: absolute;
      top: 30px;
      width: 100%;
      text-align: center;
      z-index: 3;
    }

    .top-title h1 {
      font-size: 44px;
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
    }

    /* ================= ORBLAR (3 ADET - KÜÇÜK) ================= */
    .orb {
      position: absolute;
      border-radius: 50%;
      z-index: 1;

      /* Daha solid, mat görünüm */
      background: radial-gradient(
        circle at 35% 35%,
        rgba(100, 110, 125, 0.9) 0%,
        rgba(65, 75, 85, 0.85) 35%,
        rgba(45, 52, 60, 0.9) 65%,
        rgba(30, 35, 42, 0.95) 100%
      );

      opacity: 0.95;
      filter: blur(0px);

      /* Daha belirgin gölge */
      box-shadow:
        inset -15px -15px 40px rgba(0, 0, 0, 0.5),
        inset 15px 15px 40px rgba(120, 130, 145, 0.15),
        0 25px 60px rgba(0, 0, 0, 0.8);
    }

    /* SOL ÜST */
    .orb-top-left {
      width: 200px;
      height: 200px;
      top: 80px;
      left: -60px;
    }

    /* SAĞ ÜST */
    .orb-top-right {
      width: 240px;
      height: 240px;
      top: 20px;
      right: -80px;
    }

    /* ALT ORTA */
    .orb-bottom-center {
      width: 180px;
      height: 180px;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* ================= EYES ================= */
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
      width: 16px;
      height: 16px;
      background: #f8fafc;
      border-radius: 50%;
      position: relative;
    }

    .eye::after {
      content: '';
      width: 6px;
      height: 6px;
      background: #020617;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      left: 5px;
    }

    .eyes.focused .eye {
      height: 6px;
      border-radius: 6px;
    }

    .eyes.focused .eye::after {
      opacity: 0;
    }

    /* ================= GLASS CARD ================= */
    .card {
      width: 460px;
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
      margin: 0 0 24px 0;
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
      color: rgba(255,255,255,0.5);
    }

    input:focus {
      outline: none;
      background: rgba(255,255,255,0.3);
    }

    button {
      width: 100%;
      margin-top: 28px;
      padding: 16px;
      border-radius: 18px;
      border: none;
      background: rgba(255,255,255,0.28);
      color: white;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button:hover {
      background: rgba(255,255,255,0.35);
      transform: translateY(-1px);
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 22px;
      font-size: 13px;
      color: #cbd5f5;
    }

    .links span {
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .links span:hover {
      color: white;
    }
  `]
})
export class LoginPage {

  email = '';
  password = '';
  passwordFocused = false;

  constructor(
    private router: Router,
    private authService: AuthService  // 👈 AuthService'i ekledik
  ) {}

  login() {
    // 👇 ÖNCELİKLE ROLE'Ü SET ET
    this.authService.loginAs('EMPLOYER');

    // 👇 SONRA YÖNLENDİR
    this.router.navigate(['/employer']);
  }
}
