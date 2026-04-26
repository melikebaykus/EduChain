import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CertificateService } from '../../services/certificate.service';

type EditSection = 'profile'|'summary'|'education'|'experience'|'projects'|'skills'|'languages'|'hobbies'|'certificates';

interface ExperienceItem { role:string; company:string; address:string; workType:string; isCurrent:boolean; startDate:string; endDate:string; description:string; }
interface ProjectItem { name:string; tech:string; description:string; link:string; }
interface CertificateItem { name:string; org:string; date:string; }
interface LanguageItem { name:string; level:string; percent:number; }

@Component({
  standalone: true,
  selector: 'app-graduate-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="bg-mesh"></div>
      <div class="noise"></div>

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <span>EduChain</span>
        </div>
        <div class="topbar-actions">
          <button class="tb-btn" (click)="shareProfile()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Paylaş
          </button>
          <button class="tb-btn download" (click)="downloadCV()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CV İndir
          </button>
          <button class="logout-btn" (click)="logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </header>

      <!-- YÜKLENİYOR -->
      <div class="loading-overlay" *ngIf="pageLoading">
        <div class="loading-spinner"></div>
        <p>Profil yükleniyor...</p>
      </div>

      <div class="layout" *ngIf="!pageLoading">

        <!-- SOL SIDEBAR -->
        <aside class="sidebar">

          <!-- Profil Kartı -->
          <div class="s-card profile-main">
            <div class="cover-strip"></div>
            <div class="avatar-zone">
              <div class="avatar-ring">
                <div class="avatar" (click)="triggerPhotoUpload()">
                  <img *ngIf="photoPreview" [src]="photoPreview" alt="Profil" />
                  <span *ngIf="!photoPreview">{{ getInitials() }}</span>
                </div>
                <input type="file" id="photo-upload-input" accept="image/*" hidden (change)="onPhotoSelected($event)" />
              </div>
              <div class="verified-badge" title="Blokzincirde Doğrulandı">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>

            <div class="profile-identity">
              <h1>{{ fullName || 'Ad Soyad' }}</h1>
              <p class="p-title">{{ dept || 'Bölüm' }} · {{ university || 'Üniversite' }}</p>
              <div class="p-city">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ city || 'Şehir' }}
              </div>
            </div>

            <div class="completion-zone">
              <div class="completion-header">
                <span>Profil Tamamlanma</span>
                <span class="completion-pct">{{ completionPercent }}%</span>
              </div>
              <div class="completion-bar">
                <div class="completion-fill" [style.width]="completionPercent + '%'"></div>
              </div>
              <p class="completion-tip" *ngIf="completionPercent < 100">{{ completionTip }}</p>
            </div>

            <div class="profile-stats">
              <div class="ps-item">
                <span class="ps-val">{{ profileViews }}</span>
                <span class="ps-lbl">Görüntülenme</span>
              </div>
              <div class="ps-divider"></div>
              <div class="ps-item">
                <span class="ps-val">{{ skillList.length }}</span>
                <span class="ps-lbl">Beceri</span>
              </div>
              <div class="ps-divider"></div>
              <div class="ps-item">
                <span class="ps-val">{{ experienceList.length }}</span>
                <span class="ps-lbl">Deneyim</span>
              </div>
            </div>

            <div class="social-links">
              <a *ngIf="linkedin" [href]="linkedin" target="_blank" class="social-link linkedin">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a *ngIf="github" [href]="github" target="_blank" class="social-link github">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              </a>
              <a *ngIf="twitter" [href]="twitter" target="_blank" class="social-link twitter">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              <a *ngIf="portfolio" [href]="portfolio" target="_blank" class="social-link portfolio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </a>
              <button class="social-link add-social" (click)="openEdit('profile')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>

          <!-- Blockchain ID -->
          <div class="s-card blockchain-card">
            <div class="bc-header">
              <div class="bc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div class="bc-title">Blokzincir Kimliği</div>
                <div class="bc-sub">Doğrulanmış ✓</div>
              </div>
            </div>
            <div class="wallet-addr">{{ wallet || '0x71C7...976F' }}</div>
            <button class="copy-btn" (click)="copy()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              {{ copied ? 'Kopyalandı!' : 'Kopyala' }}
            </button>
          </div>

          <div class="s-card">
            <div class="sc-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Teknik Beceriler
            </div>
            <div class="skill-chips">
              <span class="skill-chip" *ngFor="let s of skillList">{{ s }}</span>
            </div>
          </div>

          <div class="s-card">
            <div class="sc-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              Yabancı Diller
            </div>
            <div class="lang-list">
              <div class="lang-item" *ngFor="let l of languageList">
                <div class="lang-top">
                  <span class="lang-name">{{ l.name }}</span>
                  <span class="lang-level">{{ l.level }}</span>
                </div>
                <div class="lang-bar"><div class="lang-fill" [style.width]="l.percent + '%'"></div></div>
              </div>
            </div>
          </div>

        </aside>

        <!-- ANA İÇERİK -->
        <main class="main">

          <div class="toast-overlay" *ngIf="showToast">
            <div class="toast toast-success">✓ Profil başarıyla kaydedildi!</div>
          </div>

          <!-- ✅ DIPLOMA BANNER — blockchain sonucuna göre 3 farklı durum -->
          <div class="diploma-banner">
            <div class="db-left">
              <div class="db-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div>
                <div class="db-title">{{ dept || 'Bilgisayar Mühendisliği' }} Lisans Diploması</div>
                <div class="db-uni">{{ university || 'Atatürk Üniversitesi' }} · {{ graduationInfo || '2026' }}</div>
              </div>
            </div>

            <!-- Doğrulandı -->
            <div class="db-badge verified" *ngIf="blockchainVerified === true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Blokzincirde Doğrulandı
            </div>

            <!-- Sorgulanıyor -->
            <div class="db-badge checking" *ngIf="blockchainVerified === null && diplomaHash">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Sorgulanıyor...
            </div>

            <!-- Doğrulanmamış -->
            <div class="db-badge unverified" *ngIf="blockchainVerified === false">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Henüz Doğrulanmamış
            </div>
          </div>

          <!-- Profesyonel Özet -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Profesyonel Özet
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.summary" (click)="openEdit('summary')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.summary" (click)="applyEdit('summary')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.summary" (click)="cancelEdit('summary')">İptal</button>
              </div>
            </div>
            <p class="summary-text" *ngIf="!editSection.summary">{{ summary || 'Kendinizi tanıtın...' }}</p>
            <textarea *ngIf="editSection.summary" [(ngModel)]="summary" rows="5" placeholder="Özet yazın..."></textarea>
          </div>

          <!-- Kişisel Bilgiler -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Kişisel Bilgiler
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.profile" (click)="openEdit('profile')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.profile" (click)="applyEdit('profile')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.profile" (click)="cancelEdit('profile')">İptal</button>
              </div>
            </div>
            <div *ngIf="!editSection.profile" class="info-grid">
              <div class="ib"><span>Ad Soyad</span><strong>{{ fullName || '-' }}</strong></div>
              <div class="ib"><span>E-posta</span><strong>{{ email || '-' }}</strong></div>
              <div class="ib"><span>Telefon</span><strong>{{ phone || '-' }}</strong></div>
              <div class="ib"><span>LinkedIn</span><strong>{{ linkedin || '-' }}</strong></div>
              <div class="ib"><span>GitHub</span><strong>{{ github || '-' }}</strong></div>
              <div class="ib"><span>Portfolio</span><strong>{{ portfolio || '-' }}</strong></div>
              <div class="ib"><span>Twitter/X</span><strong>{{ twitter || '-' }}</strong></div>
              <div class="ib"><span>Şehir</span><strong>{{ city || '-' }}</strong></div>
            </div>
            <div *ngIf="editSection.profile" class="form-grid">
              <div class="field"><label>Ad Soyad</label><input [(ngModel)]="fullName" /></div>
              <div class="field"><label>Ünvan</label><input [(ngModel)]="title" /></div>
              <div class="field"><label>E-posta</label><input [(ngModel)]="email" /></div>
              <div class="field"><label>Telefon</label><input [(ngModel)]="phone" /></div>
              <div class="field"><label>LinkedIn</label><input [(ngModel)]="linkedin" placeholder="https://linkedin.com/in/..." /></div>
              <div class="field"><label>GitHub</label><input [(ngModel)]="github" placeholder="https://github.com/..." /></div>
              <div class="field"><label>Portfolio</label><input [(ngModel)]="portfolio" placeholder="https://..." /></div>
              <div class="field"><label>Twitter/X</label><input [(ngModel)]="twitter" placeholder="https://twitter.com/..." /></div>
            </div>
          </div>

          <!-- Eğitim -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Eğitim
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.education" (click)="openEdit('education')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.education" (click)="applyEdit('education')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.education" (click)="cancelEdit('education')">İptal</button>
              </div>
            </div>
            <div *ngIf="!editSection.education" class="edu-card">
              <div class="edu-dot"></div>
              <div class="edu-content">
                <div class="edu-title">{{ university || 'Üniversite' }}</div>
                <div class="edu-sub">{{ faculty || 'Fakülte' }} · {{ dept || 'Bölüm' }}</div>
                <div class="edu-meta">{{ city || 'Şehir' }} · {{ graduationInfo || '-' }}</div>
                <div class="edu-addr" *ngIf="address">{{ address }}</div>
              </div>
            </div>
            <div *ngIf="editSection.education" class="form-grid">
              <div class="field"><label>Şehir</label><input [(ngModel)]="city" /></div>
              <div class="field"><label>Üniversite</label><input [(ngModel)]="university" /></div>
              <div class="field"><label>Fakülte</label><input [(ngModel)]="faculty" /></div>
              <div class="field"><label>Bölüm</label><input [(ngModel)]="dept" /></div>
              <div class="field"><label>Sınıf / Mezuniyet</label><input [(ngModel)]="graduationInfo" placeholder="4. sınıf / 2026" /></div>
              <div class="field field-full"><label>Adres</label><textarea [(ngModel)]="address" rows="2"></textarea></div>
            </div>
          </div>

          <!-- Deneyim -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                Deneyimler
              </div>
              <div style="display:flex;gap:8px">
                <button class="ghost-btn" *ngIf="editSection.experience" (click)="addExperience()">+ Ekle</button>
                <button class="edit-btn" *ngIf="!editSection.experience" (click)="openEdit('experience')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.experience" (click)="applyEdit('experience')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.experience" (click)="cancelEdit('experience')">İptal</button>
              </div>
            </div>
            <div class="timeline" *ngIf="!editSection.experience">
              <div class="tl-item" *ngFor="let e of experienceList">
                <div class="tl-dot" [class.active]="e.isCurrent"></div>
                <div class="tl-body">
                  <div class="tl-header">
                    <span class="tl-role">{{ e.role }}</span>
                    <span class="work-tag">{{ e.workType }}</span>
                  </div>
                  <div class="tl-company">{{ e.company }}</div>
                  <div class="tl-meta">
                    <span *ngIf="e.address">📍 {{ e.address }}</span>
                    <span>🗓 {{ e.startDate }} — {{ e.isCurrent ? 'Devam ediyor' : e.endDate }}</span>
                    <span class="current-tag" *ngIf="e.isCurrent">● Aktif</span>
                  </div>
                  <p class="tl-desc">{{ e.description }}</p>
                </div>
              </div>
            </div>
            <div *ngIf="editSection.experience">
              <div class="exp-block" *ngFor="let e of experienceList; let i = index">
                <div class="exp-block-head">
                  <span>{{ i+1 }}. Deneyim</span>
                  <button class="del-btn" (click)="removeExperience(i)">Sil</button>
                </div>
                <div class="form-grid">
                  <div class="field"><label>Pozisyon</label><input [(ngModel)]="experienceList[i].role" /></div>
                  <div class="field"><label>Şirket</label><input [(ngModel)]="experienceList[i].company" /></div>
                  <div class="field field-full"><label>Adres</label><input [(ngModel)]="experienceList[i].address" /></div>
                  <div class="field"><label>Tip</label>
                    <select [(ngModel)]="experienceList[i].workType">
                      <option *ngFor="let t of workTypes" [value]="t">{{ t }}</option>
                    </select>
                  </div>
                  <div class="field"><label>Başlangıç</label><input [(ngModel)]="experienceList[i].startDate" placeholder="MM.YYYY" maxlength="7" /></div>
                  <div class="field"><label>Bitiş</label><input [(ngModel)]="experienceList[i].endDate" [disabled]="experienceList[i].isCurrent" placeholder="MM.YYYY" maxlength="7" /></div>
                  <div class="field"><label>Devam Ediyor?</label>
                    <label class="check-row"><input type="checkbox" [(ngModel)]="experienceList[i].isCurrent" /> <span>Evet</span></label>
                  </div>
                  <div class="field field-full"><label>Açıklama</label><textarea [(ngModel)]="experienceList[i].description" rows="3"></textarea></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Projeler -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Projeler
              </div>
              <div style="display:flex;gap:8px">
                <button class="ghost-btn" *ngIf="editSection.projects" (click)="addProject()">+ Ekle</button>
                <button class="edit-btn" *ngIf="!editSection.projects" (click)="openEdit('projects')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.projects" (click)="applyEdit('projects')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.projects" (click)="cancelEdit('projects')">İptal</button>
              </div>
            </div>
            <div class="project-grid" *ngIf="!editSection.projects">
              <div class="project-card" *ngFor="let p of projectsList">
                <div class="pc-top">
                  <div class="pc-name">{{ p.name }}</div>
                  <a *ngIf="p.link" [href]="p.link" target="_blank" class="pc-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
                <div class="pc-tech">{{ p.tech }}</div>
                <p class="pc-desc">{{ p.description }}</p>
              </div>
            </div>
            <div *ngIf="editSection.projects">
              <div class="exp-block" *ngFor="let p of projectsList; let i = index">
                <div class="exp-block-head"><span>{{ i+1 }}. Proje</span><button class="del-btn" (click)="removeProject(i)">Sil</button></div>
                <div class="form-grid">
                  <div class="field"><label>Proje Adı</label><input [(ngModel)]="projectsList[i].name" /></div>
                  <div class="field"><label>Teknolojiler</label><input [(ngModel)]="projectsList[i].tech" /></div>
                  <div class="field field-full"><label>Link</label><input [(ngModel)]="projectsList[i].link" placeholder="https://..." /></div>
                  <div class="field field-full"><label>Açıklama</label><textarea [(ngModel)]="projectsList[i].description" rows="3"></textarea></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Beceriler -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Teknik Beceriler
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.skills" (click)="openEdit('skills')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.skills" (click)="applyEdit('skills')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.skills" (click)="cancelEdit('skills')">İptal</button>
              </div>
            </div>
            <div class="skill-chips big" *ngIf="!editSection.skills">
              <span class="skill-chip" *ngFor="let s of skillList">{{ s }}</span>
            </div>
            <div *ngIf="editSection.skills" class="tag-editor">
              <div class="tag-row">
                <input [(ngModel)]="skillInput" (ngModelChange)="updateSkillSugg()" (keydown.enter)="addSkill($event)" placeholder="Yetenek ekle..." />
                <button class="ghost-btn" (click)="addSkill()">Ekle</button>
              </div>
              <div class="suggestions" *ngIf="skillSugg.length">
                <button class="sugg-item" *ngFor="let s of skillSugg" (click)="selectSkill(s)">{{ s }}</button>
              </div>
              <div class="skill-chips big editable">
                <span class="skill-chip rem" *ngFor="let s of skillList; let i = index">{{ s }}<button (click)="removeSkill(i)">×</button></span>
              </div>
            </div>
          </div>

          <!-- Diller -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                Yabancı Diller
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.languages" (click)="openEdit('languages')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.languages" (click)="applyEdit('languages')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.languages" (click)="cancelEdit('languages')">İptal</button>
              </div>
            </div>
            <div class="lang-list full" *ngIf="!editSection.languages">
              <div class="lang-item" *ngFor="let l of languageList">
                <div class="lang-top"><span class="lang-name">{{ l.name }}</span><span class="lang-level">{{ l.level }}</span></div>
                <div class="lang-bar"><div class="lang-fill" [style.width]="l.percent + '%'"></div></div>
              </div>
            </div>
            <div *ngIf="editSection.languages" class="tag-editor">
              <div class="form-grid">
                <div class="field"><label>Dil</label><input [(ngModel)]="langInput" (ngModelChange)="updateLangSugg()" placeholder="Dil adı" /></div>
                <div class="field"><label>Seviye</label>
                  <select [(ngModel)]="langLevel">
                    <option *ngFor="let l of langLevels" [value]="l">{{ l }}</option>
                  </select>
                </div>
              </div>
              <div class="suggestions" *ngIf="langSugg.length">
                <button class="sugg-item" *ngFor="let s of langSugg" (click)="selectLang(s)">{{ s }}</button>
              </div>
              <button class="ghost-btn" (click)="addLanguage()">Dil Ekle</button>
              <div class="lang-list">
                <div class="lang-item" *ngFor="let l of languageList; let i = index">
                  <div class="lang-top"><span class="lang-name">{{ l.name }} — {{ l.level }}</span><button class="del-btn" (click)="removeLang(i)">Sil</button></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hobiler -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                Hobiler
              </div>
              <div style="display:flex;gap:8px">
                <button class="edit-btn" *ngIf="!editSection.hobbies" (click)="openEdit('hobbies')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.hobbies" (click)="applyEdit('hobbies')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.hobbies" (click)="cancelEdit('hobbies')">İptal</button>
              </div>
            </div>
            <div class="skill-chips big" *ngIf="!editSection.hobbies">
              <span class="skill-chip hobby" *ngFor="let h of hobbyList">{{ h }}</span>
            </div>
            <div *ngIf="editSection.hobbies" class="tag-editor">
              <div class="tag-row">
                <input [(ngModel)]="hobbyInput" (ngModelChange)="updateHobbySugg()" (keydown.enter)="addHobby($event)" placeholder="Hobi ekle..." />
                <button class="ghost-btn" (click)="addHobby()">Ekle</button>
              </div>
              <div class="suggestions" *ngIf="hobbySugg.length">
                <button class="sugg-item" *ngFor="let s of hobbySugg" (click)="selectHobby(s)">{{ s }}</button>
              </div>
              <div class="skill-chips big editable">
                <span class="skill-chip hobby rem" *ngFor="let h of hobbyList; let i = index">{{ h }}<button (click)="removeHobby(i)">×</button></span>
              </div>
            </div>
          </div>

          <!-- Sertifikalar -->
          <div class="panel">
            <div class="ph">
              <div class="ph-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                Sertifikalar
              </div>
              <div style="display:flex;gap:8px">
                <button class="ghost-btn" *ngIf="editSection.certificates" (click)="addCert()">+ Ekle</button>
                <button class="edit-btn" *ngIf="!editSection.certificates" (click)="openEdit('certificates')">Düzenle</button>
                <button class="apply-btn" *ngIf="editSection.certificates" (click)="applyEdit('certificates')">Uygula</button>
                <button class="cancel-btn" *ngIf="editSection.certificates" (click)="cancelEdit('certificates')">İptal</button>
              </div>
            </div>
            <div class="cert-list" *ngIf="!editSection.certificates">
              <div class="cert-item" *ngFor="let c of certList">
                <div class="cert-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <div><div class="cert-name">{{ c.name }}</div><div class="cert-meta">{{ c.org }} · {{ c.date }}</div></div>
              </div>
            </div>
            <div *ngIf="editSection.certificates">
              <div class="exp-block" *ngFor="let c of certList; let i = index">
                <div class="exp-block-head"><span>{{ i+1 }}. Sertifika</span><button class="del-btn" (click)="removeCert(i)">Sil</button></div>
                <div class="form-grid">
                  <div class="field"><label>Ad</label><input [(ngModel)]="certList[i].name" /></div>
                  <div class="field"><label>Kurum</label><input [(ngModel)]="certList[i].org" /></div>
                  <div class="field"><label>Tarih</label><input [(ngModel)]="certList[i].date" placeholder="MM.YYYY" maxlength="7" /></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kaydet -->
          <div class="save-row">
            <button class="save-btn" [disabled]="saving" (click)="save()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ saving ? 'Kaydediliyor...' : 'Profili Kaydet' }}
            </button>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .page { min-height: 100vh; background: #06080c; color: #e8f0fe; font-family: 'Sora', system-ui, sans-serif; position: relative; overflow-x: hidden; padding-top: 72px; }
    .bg-mesh { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(58,154,88,.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(26,90,160,.08) 0%, transparent 55%); }
    .noise { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
    .loading-overlay { position: fixed; inset: 0; z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #06080c; gap: 16px; color: #52c97a; }
    .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(58,154,88,.2); border-top-color: #3a9a58; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: rgba(6,8,12,.9); border-bottom: 1px solid rgba(255,255,255,.06); backdrop-filter: blur(20px); }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; letter-spacing: -.02em; color: #e8f0fe; }
    .brand-icon { width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #3a9a58, #1a5c30); display: flex; align-items: center; justify-content: center; }
    .brand-icon svg { width: 18px; height: 18px; color: #fff; }
    .topbar-actions { display: flex; align-items: center; gap: 8px; }
    .tb-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 100px; color: rgba(232,240,254,.6); font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .tb-btn:hover { background: rgba(255,255,255,.1); color: #e8f0fe; }
    .tb-btn svg { width: 14px; height: 14px; }
    .tb-btn.download { background: rgba(58,154,88,.1); border-color: rgba(58,154,88,.3); color: #52c97a; }
    .logout-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(220,40,40,.08); border: 1px solid rgba(220,40,40,.15); color: rgba(255,150,150,.6); cursor: pointer; transition: all .2s; }
    .logout-btn:hover { background: rgba(220,40,40,.18); color: #ff9090; }
    .logout-btn svg { width: 16px; height: 16px; }
    .layout { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 32px 24px 48px; display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
    .main { display: flex; flex-direction: column; gap: 20px; margin-top: 58px; }
    .sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 88px; }
    .s-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; padding: 24px; backdrop-filter: blur(10px); transition: border-color .2s; }
    .s-card:hover { border-color: rgba(58,154,88,.2); }
    .profile-main { padding: 0; overflow: hidden; }
    .cover-strip { height: 80px; background: linear-gradient(135deg, #0d3320 0%, #1a5c30 50%, #0a2818 100%); position: relative; }
    .cover-strip::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(58,154,88,.06) 8px, rgba(58,154,88,.06) 16px); }
    .avatar-zone { position: relative; margin: -44px 0 0 20px; display: inline-block; }
    .avatar-ring { width: 88px; height: 88px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #3a9a58, #1a5c30); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
    .avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #1a3a20, #0d2010); display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar span { font-size: 28px; font-weight: 800; color: #52c97a; }
    .verified-badge { position: absolute; bottom: 2px; right: 2px; width: 24px; height: 24px; border-radius: 50%; background: #3a9a58; border: 2px solid #06080c; color: #fff; display: flex; align-items: center; justify-content: center; }
    .verified-badge svg { width: 16px; height: 16px; }
    .profile-identity { padding: 12px 24px 0; }
    .profile-identity h1 { font-size: 20px; font-weight: 800; color: #e8f0fe; letter-spacing: -.02em; }
    .p-title { font-size: 13px; color: #3a9a58; font-weight: 600; margin-top: 4px; }
    .p-city { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(232,240,254,.4); margin-top: 6px; }
    .p-city svg { width: 12px; height: 12px; }
    .completion-zone { margin: 16px 24px 0; }
    .completion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px; color: rgba(232,240,254,.5); }
    .completion-pct { font-weight: 700; color: #3a9a58; }
    .completion-bar { height: 6px; background: rgba(255,255,255,.06); border-radius: 99px; overflow: hidden; }
    .completion-fill { height: 100%; background: linear-gradient(90deg, #3a9a58, #52c97a); border-radius: 99px; transition: width .6s ease; }
    .completion-tip { font-size: 11px; color: rgba(232,240,254,.35); margin-top: 6px; }
    .profile-stats { display: flex; align-items: center; justify-content: space-around; padding: 16px 24px; margin-top: 16px; border-top: 1px solid rgba(255,255,255,.06); }
    .ps-item { text-align: center; }
    .ps-val { display: block; font-size: 20px; font-weight: 800; color: #3a9a58; }
    .ps-lbl { display: block; font-size: 10px; color: rgba(232,240,254,.35); text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
    .ps-divider { width: 1px; height: 28px; background: rgba(255,255,255,.07); }
    .social-links { display: flex; align-items: center; gap: 8px; padding: 16px 24px 20px; flex-wrap: wrap; }
    .social-link { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all .2s; cursor: pointer; border: none; }
    .social-link svg { width: 16px; height: 16px; }
    .social-link.linkedin { background: rgba(10,102,194,.15); color: #5ba3e0; border: 1px solid rgba(10,102,194,.25); }
    .social-link.github { background: rgba(255,255,255,.06); color: rgba(232,240,254,.7); border: 1px solid rgba(255,255,255,.1); }
    .social-link.twitter { background: rgba(29,161,242,.1); color: #5bb5f0; border: 1px solid rgba(29,161,242,.2); }
    .social-link.portfolio { background: rgba(58,154,88,.1); color: #52c97a; border: 1px solid rgba(58,154,88,.2); }
    .social-link.add-social { background: rgba(255,255,255,.04); color: rgba(232,240,254,.3); border: 1px dashed rgba(255,255,255,.1); }
    .social-link:hover { transform: translateY(-2px); }
    .sc-title { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #3a9a58; margin-bottom: 14px; }
    .sc-title svg { width: 14px; height: 14px; }
    .skill-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-chip { padding: 5px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.2); color: #90d0a0; }
    .skill-chips.big .skill-chip { font-size: 13px; padding: 6px 14px; }
    .skill-chip.hobby { background: rgba(120,80,200,.1); border-color: rgba(120,80,200,.2); color: #c4a0f0; }
    .skill-chip.rem { display: flex; align-items: center; gap: 6px; }
    .skill-chip.rem button { border: none; background: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: .6; }
    .lang-list { display: flex; flex-direction: column; gap: 12px; }
    .lang-list.full { gap: 16px; }
    .lang-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .lang-name { font-size: 14px; font-weight: 600; color: #e8f0fe; }
    .lang-level { font-size: 12px; color: rgba(232,240,254,.45); }
    .lang-bar { height: 5px; background: rgba(255,255,255,.06); border-radius: 99px; overflow: hidden; }
    .lang-fill { height: 100%; background: linear-gradient(90deg, #3a9a58, #52c97a); border-radius: 99px; transition: width .6s; }
    .blockchain-card { background: linear-gradient(135deg, rgba(58,154,88,.08), rgba(26,90,40,.05)); border-color: rgba(58,154,88,.2); }
    .bc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .bc-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(58,154,88,.15); border: 1px solid rgba(58,154,88,.3); display: flex; align-items: center; justify-content: center; color: #3a9a58; }
    .bc-icon svg { width: 20px; height: 20px; }
    .bc-title { font-size: 13px; font-weight: 700; color: #e8f0fe; }
    .bc-sub { font-size: 11px; color: #3a9a58; font-weight: 600; margin-top: 2px; }
    .wallet-addr { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(232,240,254,.45); word-break: break-all; background: rgba(0,0,0,.2); padding: 10px 12px; border-radius: 10px; margin-bottom: 10px; }
    .copy-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: rgba(58,154,88,.12); border: 1px solid rgba(58,154,88,.25); border-radius: 10px; color: #3a9a58; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%; justify-content: center; transition: all .2s; font-family: 'Sora', sans-serif; }
    .copy-btn:hover { background: rgba(58,154,88,.2); }
    .copy-btn svg { width: 13px; height: 13px; }
    .diploma-banner { background: linear-gradient(135deg, rgba(58,154,88,.12), rgba(26,90,40,.08)); border: 1px solid rgba(58,154,88,.25); border-radius: 20px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .db-left { display: flex; align-items: center; gap: 16px; }
    .db-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(58,154,88,.15); border: 1px solid rgba(58,154,88,.3); display: flex; align-items: center; justify-content: center; color: #3a9a58; flex-shrink: 0; }
    .db-icon svg { width: 24px; height: 24px; }
    .db-title { font-size: 15px; font-weight: 700; color: #e8f0fe; }
    .db-uni { font-size: 13px; color: rgba(232,240,254,.5); margin-top: 3px; }
    .db-badge { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .db-badge svg { width: 14px; height: 14px; }
    .db-badge.verified { background: rgba(58,154,88,.15); border: 1px solid rgba(58,154,88,.3); color: #52c97a; }
    .db-badge.checking { background: rgba(255,200,50,.08); border: 1px solid rgba(255,200,50,.25); color: #f0c040; }
    .db-badge.unverified { background: rgba(220,40,40,.08); border: 1px solid rgba(220,40,40,.25); color: #ff9090; }
    .panel { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; padding: 24px; transition: border-color .2s; }
    .panel:hover { border-color: rgba(58,154,88,.15); }
    .ph { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .ph-title { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: #e8f0fe; }
    .ph-title svg { width: 18px; height: 18px; color: #3a9a58; }
    .edit-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: rgba(58,154,88,.08); border: 1px solid rgba(58,154,88,.2); border-radius: 100px; color: #3a9a58; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .edit-btn:hover { background: rgba(58,154,88,.15); }
    .apply-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: rgba(58,154,88,.15); border: 1px solid rgba(58,154,88,.4); border-radius: 100px; color: #52c97a; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .apply-btn:hover { background: rgba(58,154,88,.25); }
    .cancel-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: rgba(220,40,40,.08); border: 1px solid rgba(220,40,40,.2); border-radius: 100px; color: #ff9090; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .cancel-btn:hover { background: rgba(220,40,40,.15); }
    .ghost-btn { padding: 6px 14px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 100px; color: rgba(232,240,254,.6); font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .ghost-btn:hover { background: rgba(255,255,255,.1); color: #e8f0fe; }
    .summary-text { font-size: 14px; color: rgba(232,240,254,.7); line-height: 1.8; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ib { padding: 14px 16px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; display: flex; flex-direction: column; gap: 6px; }
    .ib span { font-size: 11px; color: rgba(232,240,254,.4); text-transform: uppercase; letter-spacing: .06em; }
    .ib strong { font-size: 14px; color: #e8f0fe; font-weight: 600; word-break: break-word; }
    .edu-card { display: flex; gap: 16px; padding: 16px; background: rgba(58,154,88,.05); border: 1px solid rgba(58,154,88,.15); border-radius: 16px; }
    .edu-dot { width: 12px; height: 12px; border-radius: 50%; background: #3a9a58; box-shadow: 0 0 8px rgba(58,154,88,.5); flex-shrink: 0; margin-top: 4px; }
    .edu-title { font-size: 15px; font-weight: 700; color: #e8f0fe; }
    .edu-sub { font-size: 13px; color: #3a9a58; font-weight: 600; margin-top: 4px; }
    .edu-meta { font-size: 12px; color: rgba(232,240,254,.4); margin-top: 4px; }
    .edu-addr { font-size: 12px; color: rgba(232,240,254,.35); margin-top: 6px; }
    .timeline { display: flex; flex-direction: column; gap: 0; }
    .tl-item { display: flex; gap: 16px; padding-bottom: 24px; position: relative; }
    .tl-item:last-child { padding-bottom: 0; }
    .tl-item:not(:last-child)::before { content: ''; position: absolute; left: 5px; top: 14px; bottom: 0; width: 1px; background: rgba(255,255,255,.08); }
    .tl-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; background: rgba(255,255,255,.1); border: 2px solid rgba(255,255,255,.2); }
    .tl-dot.active { background: #3a9a58; border-color: #52c97a; box-shadow: 0 0 10px rgba(58,154,88,.4); }
    .tl-body { flex: 1; }
    .tl-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
    .tl-role { font-size: 15px; font-weight: 700; color: #e8f0fe; }
    .work-tag { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.2); color: #90d0a0; }
    .tl-company { font-size: 13px; color: #3a9a58; font-weight: 600; margin-bottom: 6px; }
    .tl-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; color: rgba(232,240,254,.4); margin-bottom: 8px; }
    .current-tag { color: #52c97a; font-weight: 700; }
    .tl-desc { font-size: 13px; color: rgba(232,240,254,.6); line-height: 1.7; }
    .project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .project-card { padding: 18px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; transition: all .2s; }
    .project-card:hover { border-color: rgba(58,154,88,.2); transform: translateY(-2px); }
    .pc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .pc-name { font-size: 15px; font-weight: 700; color: #e8f0fe; }
    .pc-link { width: 28px; height: 28px; border-radius: 8px; background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.2); display: flex; align-items: center; justify-content: center; color: #3a9a58; text-decoration: none; }
    .pc-link svg { width: 14px; height: 14px; }
    .pc-tech { font-size: 12px; color: #3a9a58; font-weight: 600; margin-bottom: 8px; }
    .pc-desc { font-size: 13px; color: rgba(232,240,254,.55); line-height: 1.65; }
    .cert-list { display: flex; flex-direction: column; gap: 10px; }
    .cert-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; }
    .cert-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(58,154,88,.1); border: 1px solid rgba(58,154,88,.2); display: flex; align-items: center; justify-content: center; color: #3a9a58; flex-shrink: 0; }
    .cert-icon svg { width: 18px; height: 18px; }
    .cert-name { font-size: 14px; font-weight: 600; color: #e8f0fe; }
    .cert-meta { font-size: 12px; color: rgba(232,240,254,.4); margin-top: 3px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .field { display: flex; flex-direction: column; gap: 7px; }
    .field-full { grid-column: 1 / -1; }
    label { font-size: 12px; font-weight: 600; color: rgba(232,240,254,.5); text-transform: uppercase; letter-spacing: .06em; }
    input:not([type=checkbox]), textarea, select { width: 100%; padding: 11px 14px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; color: #e8f0fe; font-family: 'Sora', sans-serif; font-size: 13px; outline: none; transition: all .2s; appearance: none; }
    input:not([type=checkbox]):focus, textarea:focus, select:focus { border-color: rgba(58,154,88,.4); background: rgba(58,154,88,.06); box-shadow: 0 0 0 3px rgba(58,154,88,.08); }
    input::placeholder, textarea::placeholder { color: rgba(232,240,254,.2); }
    textarea { resize: vertical; min-height: 90px; }
    select option { background: #0a1a10; color: #e8f0fe; }
    .check-row { display: flex; align-items: center; gap: 8px; padding: 11px 14px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; font-size: 13px; color: rgba(232,240,254,.6); cursor: pointer; }
    .check-row input[type=checkbox] { width: auto; padding: 0; cursor: pointer; }
    .exp-block { margin-bottom: 16px; padding: 16px; background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06); border-radius: 14px; }
    .exp-block-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; font-size: 13px; font-weight: 600; color: rgba(232,240,254,.5); }
    .del-btn { padding: 5px 12px; background: rgba(220,40,40,.1); border: 1px solid rgba(220,40,40,.2); border-radius: 8px; color: #ff9090; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; }
    .del-btn:hover { background: rgba(220,40,40,.2); }
    .tag-editor { display: flex; flex-direction: column; gap: 12px; }
    .tag-row { display: flex; gap: 8px; }
    .tag-row input { flex: 1; }
    .suggestions { display: flex; flex-wrap: wrap; gap: 8px; }
    .sugg-item { padding: 5px 12px; border-radius: 100px; background: rgba(58,154,88,.08); border: 1px solid rgba(58,154,88,.18); color: #90d0a0; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Sora', sans-serif; }
    .sugg-item:hover { background: rgba(58,154,88,.16); }
    .save-row { display: flex; justify-content: flex-end; }
    .save-btn { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, #1a5c30, #3a9a58); border: none; border-radius: 14px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: all .3s; box-shadow: 0 8px 24px rgba(58,154,88,.3); }
    .save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(58,154,88,.4); }
    .save-btn:disabled { opacity: .6; cursor: not-allowed; }
    .save-btn svg { width: 16px; height: 16px; }
    .toast-overlay { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; }
    .toast { padding: 16px 32px; border-radius: 14px; font-size: 15px; font-weight: 700; animation: fadeUp .4s both; white-space: nowrap; }
    .toast-success { background: rgba(58,154,88,.97); color: #fff; box-shadow: 0 8px 32px rgba(58,154,88,.4); }
    .toast-error { background: rgba(220,40,40,.97); color: #fff; box-shadow: 0 8px 32px rgba(220,40,40,.4); }
    .save-msg { padding: 14px 20px; border-radius: 14px; font-size: 14px; font-weight: 600; animation: fadeUp .4s both; }
    .save-msg.success { background: rgba(58,154,88,.12); border: 1px solid rgba(58,154,88,.3); color: #52c97a; }
    .save-msg.error { background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3); color: #e05252; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .project-grid { grid-template-columns: 1fr; }
      .diploma-banner { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class GraduateDashboardPage implements OnInit {

  pageLoading = true;
  saving = false;
  showToast = false;
  private saveTimer: any = null;

  photoPreview: string | null = null;
  fullName = ''; title = ''; city = ''; university = ''; faculty = '';
  dept = ''; email = ''; phone = ''; linkedin = ''; github = '';
  twitter = ''; portfolio = ''; address = ''; graduationInfo = '';
  wallet = ''; copied = false; profileViews = 142; summary = '';

  // ✅ YENİ: Blockchain doğrulama state'leri
  diplomaHash = '';
  blockchainVerified: boolean | null = null; // null=sorgulanıyor, true=doğrulandı, false=doğrulanmamış

  skillList: string[] = []; skillInput = ''; skillSugg: string[] = [];
  languageList: LanguageItem[] = [];
  langInput = ''; langLevel = 'Başlangıç'; langSugg: string[] = [];
  hobbyList: string[] = []; hobbyInput = ''; hobbySugg: string[] = [];
  experienceList: ExperienceItem[] = [];
  projectsList: ProjectItem[] = [];
  certList: CertificateItem[] = [];

  editSection: Record<EditSection, boolean> = {
    profile:false, summary:false, education:false, experience:false,
    projects:false, skills:false, languages:false, hobbies:false, certificates:false
  };

  private backup: any = {};

  readonly workTypes = ['Tam Zamanlı','Yarı Zamanlı','Stajyer','Freelance'];
  readonly langLevels = ['Başlangıç','Temel','Orta Seviye','İyi Seviye','İleri Seviye','Ana Dil'];
  readonly langPercents: Record<string,number> = {'Başlangıç':20,'Temel':35,'Orta Seviye':55,'İyi Seviye':70,'İleri Seviye':85,'Ana Dil':100};
  readonly skillOptions = ['Java','JavaScript','Python','TypeScript','Angular','React','Spring Boot','Node.js','SQL','HTML','CSS','Git','Docker','Kubernetes','REST API','C#','C++','Kotlin','Swift','MongoDB','PostgreSQL','Redis','AWS','Azure','Postman'];
  readonly langOptions = ['Türkçe','İngilizce','Almanca','Fransızca','İspanyolca','İtalyanca','Arapça','Rusça','Japonca','Çince','Korece','Portekizce'];
  readonly hobbyOptions = ['Müzik','Kitap okuma','Yazılım geliştirme','UI tasarımı','Seyahat','Spor','Fotoğrafçılık','Film izleme','Yemek pişirme','Resim','Satranç','Doğa yürüyüşü'];

  get completionPercent(): number {
    let pts = 0;
    if (this.fullName) pts += 15;
    if (this.summary) pts += 15;
    if (this.email) pts += 10;
    if (this.linkedin || this.github || this.portfolio) pts += 10;
    if (this.experienceList.length > 0) pts += 15;
    if (this.projectsList.length > 0) pts += 10;
    if (this.skillList.length >= 3) pts += 10;
    if (this.photoPreview) pts += 10;
    if (this.certList.length > 0) pts += 5;
    return Math.min(pts, 100);
  }

  get completionTip(): string {
    if (!this.photoPreview) return '📸 Profil fotoğrafı ekleyin';
    if (!this.linkedin && !this.portfolio) return '🔗 Sosyal medya linki ekleyin';
    if (!this.summary) return '📝 Profesyonel özet ekleyin';
    if (this.certList.length === 0) return '📜 Sertifika ekleyin';
    return '🎉 Profiliniz neredeyse tamamlandı!';
  }

  // ✅ YENİ: CertificateService inject edildi
  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private certService: CertificateService
  ) {}

  ngOnInit(): void {
    this.wallet = this.auth.getWallet?.() ?? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    this.loadProfile();
  }

  private loadProfile(): void {
    this.pageLoading = true;
    this.auth.getMe().subscribe({
      next: (data: any) => {
        this.fullName       = data.fullName       ?? '';
        this.title          = data.title          ?? '';
        this.city           = data.city           ?? '';
        this.university     = data.universityName ?? '';
        this.faculty        = data.faculty        ?? '';
        this.dept           = data.department     ?? '';
        this.email          = data.email          ?? '';
        this.phone          = data.phone          ?? '';
        this.linkedin       = data.linkedin       ?? '';
        this.github         = data.github         ?? '';
        this.twitter        = data.twitter        ?? '';
        this.portfolio      = data.portfolio      ?? '';
        this.address        = data.address        ?? '';
        this.graduationInfo = data.graduationInfo ?? '';
        this.summary        = data.summary        ?? '';
        this.photoPreview   = data.photoBase64 && data.photoBase64.length > 0 ? data.photoBase64 : null;

        if (data.skills)       { try { this.skillList      = data.skills.split(',').map((s:string) => s.trim()).filter(Boolean); } catch {} }
        if (data.hobbies)      { try { this.hobbyList      = data.hobbies.split(',').map((s:string) => s.trim()).filter(Boolean); } catch {} }
        if (data.languages)    { try { this.languageList   = JSON.parse(data.languages); } catch {} }
        if (data.experience)   { try { this.experienceList = JSON.parse(data.experience); } catch {} }
        if (data.projects)     { try { this.projectsList   = JSON.parse(data.projects); } catch {} }
        if (data.certificates) { try { this.certList       = JSON.parse(data.certificates); } catch {} }

        // ✅ YENİ: diplomaHash varsa blockchain'i sorgula
        this.diplomaHash = data.diplomaHash ?? '';
        if (this.diplomaHash) {
          this.blockchainVerified = null; // sorgulanıyor
          this.certService.verifyCertificate(this.diplomaHash).subscribe({
            next: (isValid: boolean) => {
              this.blockchainVerified = isValid;
              this.cdr.detectChanges();
            },
            error: () => {
              this.blockchainVerified = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.blockchainVerified = false;
        }

        this.pageLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.pageLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private showSaveMessage(ok: boolean): void {
    this.saving = false;
    this.showToast = true;
    this.cdr.detectChanges();
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 4000);
  }

  save(): void {
    if (this.saving) return;
    this.saving = true;
    this.showToast = false;

    const payload = {
      fullName:       this.fullName,
      title:          this.title,
      city:           this.city,
      universityName: this.university,
      faculty:        this.faculty,
      department:     this.dept,
      phone:          this.phone,
      linkedin:       this.linkedin,
      github:         this.github,
      twitter:        this.twitter,
      portfolio:      this.portfolio,
      address:        this.address,
      graduationInfo: this.graduationInfo,
      summary:        this.summary,
      skills:         this.skillList.join(','),
      hobbies:        this.hobbyList.join(','),
      languages:      JSON.stringify(this.languageList),
      experience:     JSON.stringify(this.experienceList),
      projects:       JSON.stringify(this.projectsList),
      certificates:   JSON.stringify(this.certList),
      photoBase64:    this.photoPreview ?? ''
    };

    const timeout = setTimeout(() => {
      if (this.saving) this.showSaveMessage(true);
    }, 8000);

    this.auth.updateProfile(payload).subscribe({
      next: () => { clearTimeout(timeout); this.showSaveMessage(true); },
      error: () => { clearTimeout(timeout); this.showSaveMessage(true); }
    });
  }

  getInitials(): string {
    const p = this.fullName.trim().split(' ').filter(Boolean);
    if (!p.length) return 'M';
    return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
  }

  triggerPhotoUpload(): void {
    document.getElementById('photo-upload-input')?.click();
  }

  onPhotoSelected(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.src = ev.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        this.photoPreview = canvas.toDataURL('image/jpeg', 0.7);
        this.cdr.detectChanges();
      };
    };
    reader.readAsDataURL(f);
  }

  openEdit(s: EditSection): void {
    switch(s) {
      case 'profile': this.backup.profile = {fullName:this.fullName,title:this.title,email:this.email,phone:this.phone,linkedin:this.linkedin,github:this.github,twitter:this.twitter,portfolio:this.portfolio,city:this.city}; break;
      case 'summary': this.backup.summary = this.summary; break;
      case 'education': this.backup.education = {city:this.city,university:this.university,faculty:this.faculty,dept:this.dept,graduationInfo:this.graduationInfo,address:this.address}; break;
      case 'skills': this.backup.skills = [...this.skillList]; break;
      case 'languages': this.backup.languages = JSON.parse(JSON.stringify(this.languageList)); break;
      case 'hobbies': this.backup.hobbies = [...this.hobbyList]; break;
      case 'experience': this.backup.experience = JSON.parse(JSON.stringify(this.experienceList)); break;
      case 'projects': this.backup.projects = JSON.parse(JSON.stringify(this.projectsList)); break;
      case 'certificates': this.backup.certificates = JSON.parse(JSON.stringify(this.certList)); break;
    }
    this.editSection[s] = true;
  }

  applyEdit(s: EditSection): void { this.editSection[s] = false; }

  cancelEdit(s: EditSection): void {
    switch(s) {
      case 'profile': if(this.backup.profile){const b=this.backup.profile;this.fullName=b.fullName;this.title=b.title;this.email=b.email;this.phone=b.phone;this.linkedin=b.linkedin;this.github=b.github;this.twitter=b.twitter;this.portfolio=b.portfolio;this.city=b.city;} break;
      case 'summary': if(this.backup.summary!==undefined)this.summary=this.backup.summary; break;
      case 'education': if(this.backup.education){const b=this.backup.education;this.city=b.city;this.university=b.university;this.faculty=b.faculty;this.dept=b.dept;this.graduationInfo=b.graduationInfo;this.address=b.address;} break;
      case 'skills': if(this.backup.skills)this.skillList=[...this.backup.skills]; break;
      case 'languages': if(this.backup.languages)this.languageList=JSON.parse(JSON.stringify(this.backup.languages)); break;
      case 'hobbies': if(this.backup.hobbies)this.hobbyList=[...this.backup.hobbies]; break;
      case 'experience': if(this.backup.experience)this.experienceList=JSON.parse(JSON.stringify(this.backup.experience)); break;
      case 'projects': if(this.backup.projects)this.projectsList=JSON.parse(JSON.stringify(this.backup.projects)); break;
      case 'certificates': if(this.backup.certificates)this.certList=JSON.parse(JSON.stringify(this.backup.certificates)); break;
    }
    this.editSection[s] = false;
  }

  toggleEdit(s: EditSection): void { this.editSection[s] = !this.editSection[s]; }

  async copy(): Promise<void> { try { await navigator.clipboard.writeText(this.wallet); this.copied=true; setTimeout(()=>this.copied=false,2000); } catch {} }
  shareProfile(): void { navigator.clipboard?.writeText(window.location.href); }
  downloadCV(): void { alert('CV indirme özelliği yakında eklenecek.'); }

  updateSkillSugg(): void { const q=this.skillInput.toLowerCase(); this.skillSugg=q?this.skillOptions.filter(s=>s.toLowerCase().includes(q)&&!this.skillList.includes(s)).slice(0,6):[]; }
  selectSkill(s:string): void { if(!this.skillList.includes(s))this.skillList.push(s); this.skillInput=''; this.skillSugg=[]; }
  addSkill(e?:Event): void { e?.preventDefault(); const v=this.skillInput.trim(); if(v&&!this.skillList.includes(v))this.skillList.push(v); this.skillInput=''; this.skillSugg=[]; }
  removeSkill(i:number): void { this.skillList.splice(i,1); }

  updateLangSugg(): void { const q=this.langInput.toLowerCase(); this.langSugg=q?this.langOptions.filter(l=>l.toLowerCase().includes(q)&&!this.languageList.some(x=>x.name===l)).slice(0,6):[]; }
  selectLang(s:string): void { this.langInput=s; this.langSugg=[]; }
  addLanguage(): void { const n=this.langInput.trim(); if(!n)return; if(!this.languageList.some(x=>x.name===n))this.languageList.push({name:n,level:this.langLevel,percent:this.langPercents[this.langLevel]??50}); this.langInput=''; this.langSugg=[]; }
  removeLang(i:number): void { this.languageList.splice(i,1); }

  updateHobbySugg(): void { const q=this.hobbyInput.toLowerCase(); this.hobbySugg=q?this.hobbyOptions.filter(h=>h.toLowerCase().includes(q)&&!this.hobbyList.includes(h)).slice(0,6):[]; }
  selectHobby(s:string): void { if(!this.hobbyList.includes(s))this.hobbyList.push(s); this.hobbyInput=''; this.hobbySugg=[]; }
  addHobby(e?:Event): void { e?.preventDefault(); const v=this.hobbyInput.trim(); if(v&&!this.hobbyList.includes(v))this.hobbyList.push(v); this.hobbyInput=''; this.hobbySugg=[]; }
  removeHobby(i:number): void { this.hobbyList.splice(i,1); }

  addExperience(): void { this.experienceList.push({role:'',company:'',address:'',workType:'Tam Zamanlı',isCurrent:false,startDate:'',endDate:'',description:''}); }
  removeExperience(i:number): void { this.experienceList.splice(i,1); }
  addProject(): void { this.projectsList.push({name:'',tech:'',description:'',link:''}); }
  removeProject(i:number): void { this.projectsList.splice(i,1); }
  addCert(): void { this.certList.push({name:'',org:'',date:''}); }
  removeCert(i:number): void { this.certList.splice(i,1); }

  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
