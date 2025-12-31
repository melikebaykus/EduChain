import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * 🔹 Backend'in GERÇEKTEN döndürdüğü response
 * {
 *   "status": "GEÇERLİ" | "GEÇERSİZ" | "İPTAL"
 * }
 */
export interface VerifyResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * 🔐 Sertifika Hash doğrulama
   */
  verifyCertificate(hash: string): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>(
      `${this.BASE_URL}/verify`,
      { hash }
    );
  }
}
