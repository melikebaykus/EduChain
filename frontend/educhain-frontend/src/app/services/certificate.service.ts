import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  // 🔗 Backendciden gelen ngrok URL
  private baseUrl = 'https://predisastrously-relevant-barb.ngrok-free.dev';

  constructor(private http: HttpClient) {}

  verifyCertificate(hash: string): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>(
        `${this.baseUrl}/api/verify`,
        { hash }
      )
      .pipe(
        map(response => response.valid)
      );
  }
}
