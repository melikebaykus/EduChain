import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>EduChain</h2>

        <nav>
          <a routerLink="/admin">Admin</a>
          <a routerLink="/university">University</a>
          <a routerLink="/graduate">Graduate</a>
          <a routerLink="/employer">Employer</a>
        </nav>

        <button (click)="logout()">Logout</button>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      font-family: Arial;
    }
    .sidebar {
      width: 220px;
      background: #1f2937;
      color: white;
      padding: 20px;
    }
    .sidebar a {
      display: block;
      color: white;
      text-decoration: none;
      margin: 10px 0;
    }
    .content {
      flex: 1;
      padding: 20px;
      background: #f3f4f6;
    }
    button {
      margin-top: 20px;
    }
  `]
})
export class MainLayoutComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
    location.href = '/login';
  }
}
