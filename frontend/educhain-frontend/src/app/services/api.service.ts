import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type VerifyStatus = 'VALID' | 'INVALID' | 'REVOKED';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  verifyCertificate(hash: string): Observable<{ status: VerifyStatus }> {
    return this.http.post<{ status: VerifyStatus }>(
      `${this.BASE_URL}/verify`,
      { hash }
    );
  }
}
