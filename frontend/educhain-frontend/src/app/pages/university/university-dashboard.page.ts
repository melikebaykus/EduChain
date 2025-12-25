import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-university-dashboard',
  imports: [CommonModule],
  template: `
    <h1>University Dashboard</h1>

    <div style="max-width:500px; margin-top:20px;">
      <label><b>Diploma / Certificate PDF</b></label>

      <input
        type="file"
        accept="application/pdf"
        (change)="onFileSelected($event)"
        style="display:block; margin:10px 0;"
      />

      <button
        (click)="upload()"
        [disabled]="loading || !selectedFile"
        style="padding:8px 16px;"
      >
        {{ loading ? 'Uploading...' : 'Upload Certificate' }}
      </button>

      <div *ngIf="message" style="margin-top:15px;">
        <span [style.color]="success ? 'green' : 'red'" style="font-weight:bold;">
          {{ message }}
        </span>
      </div>
    </div>
  `
})
export class UniversityDashboardPage {
  selectedFile: File | null = null;
  loading = false;
  message: string | null = null;
  success = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = null;
    }
  }

  upload() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.message = null;

    // 🔴 MOCK upload (backend yokken)
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.message = '✅ Certificate uploaded successfully (mock)';

      this.cdr.detectChanges();
    }, 1500);
  }
}
