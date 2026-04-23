import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../types/role';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <div class="bg-grid"></div>
      <div class="bg-glow glow-1"></div>
      <div class="bg-glow glow-2"></div>

      <header class="topbar">
        <div class="brand">
          <div class="brand-text">EduChain</div>
          <div class="brand-sub">SERTİFİKA VE DİPLOMA DOĞRULAMA PLATFORMU</div>
        </div>
        <button class="top-login-btn" (click)="openAuthPanel()">
          Giriş Yap
        </button>
      </header>

      <section class="hero">
        <div class="hero-left">
          <p class="eyebrow">BLOCKCHAIN TABANLI DOĞRULAMA PLATFORMU</p>

          <h1>
            Diplomaların
            <span>blockchain'deki</span>
            güvencesi.
          </h1>

          <p class="hero-description">
            EduChain, diploma ve sertifika kayıtlarını güvenli, değiştirilemez ve hızlı şekilde
            doğrulamak için geliştirilen blockchain tabanlı bir doğrulama platformudur.
            Kurumlar, mezunlar ve işverenler için şeffaf bir kontrol süreci sunar.
          </p>

          <div class="hero-actions">
            <button class="primary-btn" (click)="openAuthPanel()">
              Giriş Yap
            </button>
            <a class="secondary-btn" href="#about">
              Hakkımızda
            </a>
          </div>
        </div>

        <div class="hero-right">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">Güvenli Altyapı</div>
              <div class="stat-label">Kriptografik koruma</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">Hızlı Doğrulama</div>
              <div class="stat-label">Saniyeler içinde sonuç</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">Rol Bazlı Erişim</div>
              <div class="stat-label">Üniversite · Mezun · İşveren</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">Şeffaf Süreç</div>
              <div class="stat-label">İzlenebilir kontrol yapısı</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="about-section">
        <div class="section-title-wrap">
          <p class="section-eyebrow">HAKKIMIZDA</p>
          <h2>Profesyonel ve güvenilir diploma doğrulama deneyimi</h2>
        </div>
        <div class="about-grid">
          <div class="about-card">
            <h3>Güvenli Altyapı</h3>
            <p>EduChain, diploma ve sertifika verilerini kriptografik yöntemlerle koruyarak doğrulama sürecinde güvenilirlik sağlar. Bu yapı, belge sahteciliği riskini azaltır ve veri bütünlüğünü güçlendirir.</p>
          </div>
          <div class="about-card">
            <h3>Şeffaf Doğrulama</h3>
            <p>Üniversiteler, mezunlar ve işverenler arasında şeffaf bir kontrol mekanizması sunar. Belgelerin geçerliliği sistematik ve hızlı biçimde kontrol edilebilir.</p>
          </div>
          <div class="about-card">
            <h3>Kullanıcı Odaklı Deneyim</h3>
            <p>Sade ve modern arayüzü sayesinde farklı kullanıcı rollerine özel erişim sunar. Böylece doğrulama ve belge yönetimi süreçleri daha anlaşılır hale gelir.</p>
          </div>
        </div>
      </section>

      <div class="modal-backdrop" *ngIf="authPanelOpen" (click)="closeAuthPanel()"></div>

      <div class="auth-modal" *ngIf="authPanelOpen">
        <button class="close-btn" (click)="closeAuthPanel()">×</button>
        <div class="modal-header">
          <p class="modal-eyebrow">EDUCHAIN GİRİŞ PANELİ</p>
          <h3>Rolünü seçerek devam et</h3>
          <p class="modal-desc">
            Devam etmek için kullanıcı rolünü seç. Seçimin sonrası ilgili giriş ekranına yönlendirilirsin.
          </p>
        </div>
        <div class="role-grid">
          <button class="role-card" (click)="goToRolePage('UNIVERSITY')">
            <div class="role-icon">🏛️</div>
            <div class="role-title">Üniversite</div>
            <div class="role-text">Belge oluşturan ve kayıt yöneten kurum paneli</div>
          </button>
          <button class="role-card" (click)="goToRolePage('GRADUATE')">
            <div class="role-icon">🎓</div>
            <div class="role-title">Mezun</div>
            <div class="role-text">Belgelerini görüntüleyen ve paylaşan kullanıcı</div>
          </button>
          <button class="role-card" (click)="goToRolePage('EMPLOYER')">
            <div class="role-icon">💼</div>
            <div class="role-title">İşveren</div>
            <div class="role-text">Diploma doğrulama yapan kurum veya şirket</div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      color: #ffffff;
      font-family: Inter, Arial, sans-serif;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    .landing-page {
      position: relative;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(79, 70, 229, 0.12), transparent 28%),
        radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.10), transparent 30%),
        #03050b;
      overflow-x: hidden;
    }

    .bg-grid {
      position: fixed; inset: 0; pointer-events: none; opacity: 0.10;
      background-image:
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    .bg-glow {
      position: fixed; border-radius: 999px;
      filter: blur(120px); pointer-events: none; opacity: 0.16;
    }
    .glow-1 { top: 90px; left: -80px; width: 300px; height: 300px; background: #4f46e5; }
    .glow-2 { right: -100px; bottom: 60px; width: 340px; height: 340px; background: #2563eb; }

    /* ── Topbar ── */
    .topbar {
      position: sticky; top: 0; z-index: 20;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 48px;
      background: rgba(3, 5, 11, 0.72);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      flex: 1;
      text-align: center;
    }

    .brand-text {
      font-size: 1.7rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #fff 40%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-sub {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      color: rgba(129, 140, 248, 0.7);
      text-transform: uppercase;
    }

    .top-login-btn {
      position: absolute;
      right: 48px;
      border: 1px solid rgba(130, 150, 255, 0.22);
      background: rgba(255,255,255,0.04);
      color: #f8fafc;
      padding: 12px 20px;
      border-radius: 14px;
      font-size: 0.98rem;
      font-weight: 600;
      cursor: pointer;
      transition: 0.25s ease;
    }
    .top-login-btn:hover {
      background: rgba(79, 70, 229, 0.18);
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }

    /* ── Hero ── */
    .hero {
      position: relative; z-index: 2;
      min-height: calc(100vh - 90px);
      display: grid; grid-template-columns: 1.15fr 0.85fr;
      gap: 48px; align-items: center;
      padding: 72px 48px 56px;
      max-width: 1400px; margin: 0 auto;
    }

    .eyebrow {
      color: #94a3b8; letter-spacing: 2px;
      font-size: 0.82rem; margin-bottom: 18px;
    }

    .hero-left h1 {
      margin: 0;
      font-size: clamp(3rem, 7vw, 5.4rem);
      line-height: 0.98; font-weight: 800; max-width: 760px;
    }
    .hero-left h1 span { color: #8194ff; }

    .hero-description {
      margin-top: 28px; max-width: 720px;
      font-size: 1.26rem; line-height: 1.8; color: #9ca3af;
    }

    .hero-actions {
      display: flex; gap: 16px; margin-top: 34px; flex-wrap: wrap;
    }

    .primary-btn, .secondary-btn {
      min-width: 180px; padding: 16px 22px; border-radius: 16px;
      font-weight: 700; font-size: 1rem; text-decoration: none;
      cursor: pointer; transition: 0.25s ease;
      display: inline-flex; justify-content: center; align-items: center;
    }
    .primary-btn {
      border: none;
      background: linear-gradient(135deg, #4f46e5, #3b82f6);
      color: white; box-shadow: 0 12px 30px rgba(79, 70, 229, 0.30);
    }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(79, 70, 229, 0.40); }
    .secondary-btn {
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.03); color: #f8fafc;
    }
    .secondary-btn:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }

    .hero-right { display: flex; flex-direction: column; gap: 22px; }

    .stats-grid {
      display: grid; grid-template-columns: repeat(2, minmax(160px, 1fr)); gap: 18px;
    }

    .stat-card, .about-card, .auth-modal {
      background: rgba(10, 14, 24, 0.72);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      backdrop-filter: blur(10px);
    }

    .stat-card {
      min-height: 180px; border-radius: 24px; padding: 28px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #f8fafc; margin-bottom: 12px; line-height: 1.2; }
    .stat-label { color: #94a3b8; font-size: 1rem; line-height: 1.6; }

    /* ── About ── */
    .about-section {
      position: relative; z-index: 2;
      max-width: 1400px; margin: 0 auto; padding: 80px 48px 120px;
    }
    .section-title-wrap { max-width: 760px; margin-bottom: 34px; }
    .section-eyebrow { color: #7c8ab8; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 12px; }
    .section-title-wrap h2 { margin: 0; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.15; }

    .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .about-card { border-radius: 24px; padding: 28px; }
    .about-card h3 { margin-top: 0; margin-bottom: 14px; font-size: 1.2rem; }
    .about-card p { color: #9ca3af; line-height: 1.8; margin: 0; }

    /* ── Modal ── */
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); z-index: 29;
    }
    .auth-modal {
      position: fixed; z-index: 30; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: min(960px, calc(100vw - 32px));
      border-radius: 28px; padding: 32px;
    }
    .close-btn {
      position: absolute; top: 16px; right: 16px;
      width: 42px; height: 42px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.04);
      color: white; font-size: 1.5rem; cursor: pointer;
    }
    .modal-header h3 { margin: 8px 0 8px; font-size: 2rem; }
    .modal-eyebrow { margin: 0; color: #7c8ab8; letter-spacing: 2px; font-size: 0.8rem; }
    .modal-desc { color: #9ca3af; max-width: 620px; line-height: 1.7; margin-bottom: 28px; }

    .role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .role-card {
      text-align: left; border-radius: 22px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      padding: 22px; color: white; cursor: pointer; transition: 0.25s ease;
    }
    .role-card:hover {
      border-color: rgba(99, 102, 241, 0.7);
      background: rgba(79, 70, 229, 0.14);
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(79, 70, 229, 0.22);
    }
    .role-icon { font-size: 2rem; margin-bottom: 12px; }
    .role-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .role-text { color: #9ca3af; font-size: 0.95rem; line-height: 1.6; }

    /* ── Responsive ── */
    @media (max-width: 1100px) {
      .hero { grid-template-columns: 1fr; padding-top: 56px; }
      .hero-left h1 { max-width: 100%; }
      .about-grid, .role-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .topbar, .hero, .about-section { padding-left: 20px; padding-right: 20px; }
      .top-login-btn { right: 20px; }
      .brand-text { font-size: 1.3rem; }
      .brand-sub { font-size: 0.55rem; letter-spacing: 0.1em; }
      .hero-left h1 { font-size: 2.8rem; }
      .hero-description { font-size: 1.05rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .auth-modal { padding: 24px 18px; }
      .modal-header h3 { font-size: 1.5rem; }
    }
  `]
})
export class LoginPage {
  authPanelOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  openAuthPanel() { this.authPanelOpen = true; }
  closeAuthPanel() { this.authPanelOpen = false; }

  goToRolePage(role: UserRole) {
    this.authPanelOpen = false;
    if (role === 'GRADUATE') {
      void this.router.navigate(['/graduate-auth']);
    } else if (role === 'EMPLOYER') {
      void this.router.navigate(['/employer']);
    } else if (role === 'UNIVERSITY') {
      void this.router.navigate(['/university-auth']);
    }
  }
}
