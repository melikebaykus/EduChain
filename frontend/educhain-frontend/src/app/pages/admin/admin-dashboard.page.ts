import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-admin-dashboard', // 🔴 BENZERSİZ SELECTOR
  imports: [CommonModule],
  template: `
    <h1>Admin Dashboard</h1>
    <p>✓ Üniversite ekleme</p>
    <p>✓ Üniversite silme</p>
  `
})
export class AdminDashboardPage {}
