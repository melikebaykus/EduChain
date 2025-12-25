import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>404 - Sayfa bulunamadı</h1>
    <a routerLink="/login">Login'e dön</a>
  `
})
export class NotFoundPage {}
