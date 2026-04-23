import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-employer-graduates',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <canvas id="bg-canvas-egrads"></canvas>
      <div class="grid-overlay"></div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <!-- TOP NAV -->
      <nav class="topnav">
        <div class="nav-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
          <span>İşveren Portalı</span>
        </div>
        <div class="nav-actions">
          <button class="nav-btn" (click)="back()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Doğrulama
          </button>
          <button class="logout-btn" (click)="logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Çıkış
          </button>
        </div>
      </nav>

      <div class="layout">

        <!-- HEADER -->
        <div class="page-header">
          <div class="page-header-left">
            <div class="page-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <h1 class="page-title">Mezun Listesi</h1>
              <p class="page-sub">Doğrulanmış mezun kayıtları — {{ graduates.length }} kayıt</p>
            </div>
          </div>
          <div class="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" [(ngModel)]="searchQuery" placeholder="İsim, üniversite veya bölüm ara..." />
          </div>
        </div>

        <!-- STATS ROW -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-val">{{ verifiedCount }}</div>
              <div class="stat-lbl">Doğrulandı</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div>
              <div class="stat-val">{{ graduates.length }}</div>
              <div class="stat-lbl">Toplam Mezun</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
            </div>
            <div>
              <div class="stat-val">{{ uniCount }}</div>
              <div class="stat-lbl">Üniversite</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <div>
              <div class="stat-val">{{ pendingCount }}</div>
              <div class="stat-lbl">Beklemede</div>
            </div>
          </div>
        </div>

        <!-- GRADUATE LIST -->
        <div class="graduates-grid" *ngIf="filteredGraduates.length > 0">
          <div class="graduate-card" *ngFor="let g of filteredGraduates">
            <div class="gc-left">
              <div class="gc-avatar" [style.background]="g.avatarBg">{{ g.initials }}</div>
            </div>
            <div class="gc-info">
              <div class="gc-name">{{ g.name }}</div>
              <div class="gc-dept">{{ g.department }}</div>
              <div class="gc-uni">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
                {{ g.university }}
              </div>
              <div class="gc-tags">
                <span class="gc-year">{{ g.year }}</span>
                <span class="gc-badge" [class.verified]="g.verified" [class.pending]="!g.verified">
                  <svg *ngIf="g.verified" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <svg *ngIf="!g.verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ g.verified ? 'Doğrulandı' : 'Beklemede' }}
                </span>
              </div>
            </div>
            <button class="gc-action" (click)="viewGraduate(g)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" *ngIf="filteredGraduates.length === 0 && searchQuery">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <p class="empty-title">Sonuç bulunamadı</p>
          <p class="empty-desc">"{{ searchQuery }}" için eşleşen mezun kaydı yok.</p>
        </div>

        <div class="empty-state" *ngIf="graduates.length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <p class="empty-title">Henüz mezun kaydı yok</p>
          <p class="empty-desc">Backend entegrasyonu tamamlandığında mezun listesi burada görünecek.</p>
          <button class="back-action-btn" (click)="back()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Diploma Doğrulamaya Git
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page { min-height: 100vh; font-family: 'DM Sans', system-ui, sans-serif; color: #f0e8d8; position: relative; overflow-x: hidden; }

    #bg-canvas-egrads { position: fixed; inset: 0; z-index: 0; }
    .grid-overlay { position: fixed; inset: 0; z-index: 1; pointer-events: none; background-image: linear-gradient(rgba(109,40,217,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(109,40,217,.025) 1px,transparent 1px); background-size: 60px 60px; }
    .blob { position: fixed; border-radius: 50%; filter: blur(110px); z-index: 1; pointer-events: none; animation: blobFloat linear infinite; }
    .blob-1 { width: 520px; height: 520px; background: #1e1050; top: -150px; left: -150px; opacity: .4; animation-duration: 14s; }
    .blob-2 { width: 400px; height: 400px; background: #130a3a; bottom: -80px; right: -80px; opacity: .35; animation-duration: 17s; animation-delay: -6s; }
    .blob-3 { width: 280px; height: 280px; background: rgba(109,40,217,.06); top: 40%; left: 50%; opacity: .5; animation-duration: 11s; animation-delay: -3s; }
    @keyframes blobFloat { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-30px) scale(1.05)} 66%{transform:translate(-15px,15px) scale(.96)} 100%{transform:translate(0,0) scale(1)} }

    /* TOPNAV */
    .topnav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; background: rgba(10,3,30,.85); border-bottom: 1px solid rgba(109,40,217,.15); backdrop-filter: blur(20px); }
    .nav-brand { display: flex; align-items: center; gap: 10px; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #fff, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-brand svg { width: 20px; height: 20px; stroke: #6d28d9; -webkit-text-fill-color: initial; color: #6d28d9; }
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .nav-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; background: rgba(109,40,217,.08); border: 1px solid rgba(109,40,217,.2); border-radius: 100px; color: rgba(196,181,253,.6); font-size: 12px; font-weight: 500; cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif; }
    .nav-btn:hover { background: rgba(109,40,217,.18); color: #c4b5fd; border-color: rgba(109,40,217,.4); }
    .nav-btn svg { width: 14px; height: 14px; }
    .logout-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; background: rgba(220,40,40,.08); border: 1px solid rgba(220,40,40,.15); border-radius: 100px; color: rgba(255,150,150,.6); font-size: 12px; font-weight: 500; cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif; }
    .logout-btn:hover { background: rgba(220,40,40,.18); color: #ff9090; border-color: rgba(220,40,40,.4); }
    .logout-btn svg { width: 14px; height: 14px; }

    /* LAYOUT */
    .layout { position: relative; z-index: 10; max-width: 1000px; margin: 0 auto; padding: 80px 24px 48px; display: flex; flex-direction: column; gap: 24px; }

    /* HEADER */
    .page-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; padding-top: 12px; animation: fadeUp .6s .1s both; }
    .page-header-left { display: flex; align-items: center; gap: 18px; }
    .page-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #6d28d9, #3b1a78); box-shadow: 0 8px 28px rgba(109,40,217,.4); display: flex; align-items: center; justify-content: center; }
    .page-icon svg { width: 26px; height: 26px; }
    .page-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #fff, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .page-sub { font-size: 13px; color: rgba(196,181,253,.4); margin-top: 3px; }

    .search-wrap { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: rgba(255,255,255,.04); border: 1px solid rgba(109,40,217,.15); border-radius: 13px; min-width: 300px; backdrop-filter: blur(10px); transition: all .2s; }
    .search-wrap:focus-within { border-color: rgba(109,40,217,.4); background: rgba(109,40,217,.06); box-shadow: 0 0 0 3px rgba(109,40,217,.08); }
    .search-wrap svg { width: 16px; height: 16px; color: rgba(196,181,253,.35); flex-shrink: 0; }
    .search-wrap input { background: none; border: none; outline: none; color: #f0e8d8; font-family: 'DM Sans', sans-serif; font-size: 13px; width: 100%; }
    .search-wrap input::placeholder { color: rgba(196,181,253,.25); }

    /* STATS */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; animation: fadeUp .6s .15s both; }
    .stat-card { background: rgba(12,5,35,.82); border: 1px solid rgba(109,40,217,.15); border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; backdrop-filter: blur(20px); }
    .stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon svg { width: 18px; height: 18px; }
    .stat-icon.green { background: rgba(34,197,94,.12); color: #52c97a; border: 1px solid rgba(34,197,94,.2); }
    .stat-icon.purple { background: rgba(109,40,217,.12); color: #a78bfa; border: 1px solid rgba(109,40,217,.2); }
    .stat-icon.blue { background: rgba(59,130,246,.12); color: #93c5fd; border: 1px solid rgba(59,130,246,.2); }
    .stat-icon.orange { background: rgba(251,146,60,.12); color: #fdba74; border: 1px solid rgba(251,146,60,.2); }
    .stat-val { font-size: 22px; font-weight: 700; color: #f0e8d8; font-family: 'Cormorant Garamond', serif; line-height: 1; }
    .stat-lbl { font-size: 11px; color: rgba(196,181,253,.35); text-transform: uppercase; letter-spacing: .06em; margin-top: 3px; }

    /* GRADUATES GRID */
    .graduates-grid { display: flex; flex-direction: column; gap: 12px; animation: fadeUp .6s .2s both; }
    .graduate-card {
      background: rgba(12,5,35,.82); border: 1px solid rgba(109,40,217,.15);
      border-radius: 18px; padding: 20px 24px; backdrop-filter: blur(20px);
      display: flex; align-items: center; gap: 18px;
      transition: all .25s; cursor: default;
    }
    .graduate-card:hover { border-color: rgba(109,40,217,.35); background: rgba(109,40,217,.06); transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,.3); }

    .gc-left { flex-shrink: 0; }
    .gc-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #fff; font-family: 'Cormorant Garamond', serif; }

    .gc-info { flex: 1; }
    .gc-name { font-size: 15px; font-weight: 600; color: #f0e8d8; margin-bottom: 3px; }
    .gc-dept { font-size: 13px; color: #a78bfa; font-weight: 500; margin-bottom: 4px; }
    .gc-uni { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(196,181,253,.4); margin-bottom: 10px; }
    .gc-uni svg { width: 12px; height: 12px; flex-shrink: 0; }
    .gc-tags { display: flex; align-items: center; gap: 8px; }
    .gc-year { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-family: monospace; background: rgba(109,40,217,.08); border: 1px solid rgba(109,40,217,.15); color: rgba(196,181,253,.5); }
    .gc-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; }
    .gc-badge svg { width: 12px; height: 12px; }
    .gc-badge.verified { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #52c97a; }
    .gc-badge.pending { background: rgba(251,146,60,.1); border: 1px solid rgba(251,146,60,.25); color: #fdba74; }

    .gc-action { width: 38px; height: 38px; border-radius: 10px; background: rgba(109,40,217,.08); border: 1px solid rgba(109,40,217,.15); color: rgba(196,181,253,.4); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; flex-shrink: 0; }
    .gc-action:hover { background: rgba(109,40,217,.2); color: #c4b5fd; border-color: rgba(109,40,217,.4); }
    .gc-action svg { width: 16px; height: 16px; }

    /* EMPTY */
    .empty-state { text-align: center; padding: 60px 32px; background: rgba(12,5,35,.82); border: 1px solid rgba(109,40,217,.15); border-radius: 22px; backdrop-filter: blur(20px); animation: fadeUp .6s .2s both; }
    .empty-icon { width: 80px; height: 80px; margin: 0 auto 20px; opacity: .15; color: #6d28d9; }
    .empty-icon svg { width: 80px; height: 80px; }
    .empty-title { font-size: 18px; font-weight: 600; color: rgba(196,181,253,.5); margin-bottom: 10px; font-family: 'Cormorant Garamond', serif; }
    .empty-desc { font-size: 13px; color: rgba(196,181,253,.3); line-height: 1.65; max-width: 320px; margin: 0 auto 28px; }
    .back-action-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(109,40,217,.12); border: 1px solid rgba(109,40,217,.25); border-radius: 13px; color: #c4b5fd; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
    .back-action-btn:hover { background: rgba(109,40,217,.22); border-color: #6d28d9; }
    .back-action-btn svg { width: 16px; height: 16px; }

    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  `]
})
export class EmployerGraduatesPage implements OnInit, AfterViewInit, OnDestroy {

  searchQuery = '';

  graduates = [
    { name: 'Ahmet Yılmaz', initials: 'AY', department: 'Bilgisayar Mühendisliği', university: 'İstanbul Teknik Üniversitesi', year: '2024', verified: true, avatarBg: 'linear-gradient(135deg,#6d28d9,#3b1a78)' },
    { name: 'Zeynep Kaya', initials: 'ZK', department: 'Elektrik-Elektronik Mühendisliği', university: 'Boğaziçi Üniversitesi', year: '2023', verified: true, avatarBg: 'linear-gradient(135deg,#0ea5e9,#0369a1)' },
    { name: 'Mehmet Demir', initials: 'MD', department: 'Makine Mühendisliği', university: 'ODTÜ', year: '2024', verified: false, avatarBg: 'linear-gradient(135deg,#f59e0b,#b45309)' },
    { name: 'Elif Şahin', initials: 'EŞ', department: 'İşletme', university: 'Hacettepe Üniversitesi', year: '2023', verified: true, avatarBg: 'linear-gradient(135deg,#ec4899,#9d174d)' },
    { name: 'Can Arslan', initials: 'CA', department: 'Yazılım Mühendisliği', university: 'Sabancı Üniversitesi', year: '2024', verified: false, avatarBg: 'linear-gradient(135deg,#10b981,#065f46)' },
  ];

  get filteredGraduates() {
    if (!this.searchQuery.trim()) return this.graduates;
    const q = this.searchQuery.toLowerCase();
    return this.graduates.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.department.toLowerCase().includes(q) ||
      g.university.toLowerCase().includes(q)
    );
  }

  get verifiedCount() { return this.graduates.filter(g => g.verified).length; }
  get pendingCount()  { return this.graduates.filter(g => !g.verified).length; }
  get uniCount()      { return new Set(this.graduates.map(g => g.university)).size; }

  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private pts: any[] = [];
  private animId?: number;
  private resizeHandler?: () => void;
  private splashEl: HTMLElement | null = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.splashEl = document.createElement('div');
    this.splashEl.innerHTML = `
      <div style="width:72px;height:72px;border-radius:22px;margin-bottom:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6d28d9,#3b1a78);box-shadow:0 0 40px rgba(109,40,217,.4)">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      </div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Mezun Listesi</div>
      <div style="font-size:13px;color:rgba(196,181,253,.5);letter-spacing:.1em;margin-top:6px">Doğrulanmış mezun kayıtları</div>
      <div style="display:flex;gap:8px;margin-top:28px">
        <span style="width:8px;height:8px;border-radius:50%;background:#6d28d9;animation:spd 1.3s ease-in-out infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#c4b5fd;animation:spd 1.3s ease-in-out .2s infinite"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#a78bfa;animation:spd 1.3s ease-in-out .4s infinite"></span>
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
    this.canvas = document.getElementById('bg-canvas-egrads') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeHandler = () => { this.canvas!.width = window.innerWidth; this.canvas!.height = window.innerHeight; };
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
    this.pts = Array.from({ length: 100 }, () => ({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.4+.3, a: Math.random()*.4+.08, warm: Math.random()>.7 }));
    const loop = () => {
      const W=this.canvas!.width, H=this.canvas!.height, c=this.ctx!;
      c.clearRect(0,0,W,H);
      const g=c.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.75);
      g.addColorStop(0,'#0e0530'); g.addColorStop(1,'#020608');
      c.fillStyle=g; c.fillRect(0,0,W,H);
      for(let i=0;i<this.pts.length;i++) for(let j=i+1;j<this.pts.length;j++){
        const dx=this.pts[i].x-this.pts[j].x,dy=this.pts[i].y-this.pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){c.strokeStyle=`rgba(109,40,217,${.05*(1-d/110)})`;c.lineWidth=.5;c.beginPath();c.moveTo(this.pts[i].x,this.pts[i].y);c.lineTo(this.pts[j].x,this.pts[j].y);c.stroke();}
      }
      this.pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);c.fillStyle=p.warm?`rgba(109,40,217,${p.a})`:`rgba(196,181,253,${p.a*.4})`;c.fill();});
      this.animId=requestAnimationFrame(loop);
    };
    loop();
  }

  viewGraduate(g: any): void { console.log('Mezun görüntülendi:', g); }
  back(): void { this.router.navigate(['/employer/dashboard']); }
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
