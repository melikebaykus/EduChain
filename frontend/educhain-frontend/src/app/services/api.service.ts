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

  verifyCertificatePdf(
    file: File,
    universityName: string,
    department: string,
    studentNumber: string
  ): Observable<{ status: string }> {
    const form = new FormData();
    form.append('file', file);
    form.append('universityName', universityName);
    form.append('department', department);
    form.append('studentNumber', studentNumber);

    return this.http.post<{ status: string }>(
      `${this.BASE_URL}/verify-pdf`,
      form
    );
  }

  getUniversities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/students/universities`);
  }

  getDepartmentsByUniversity(universityName: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.BASE_URL}/students/departments`,
      { params: { universityName } }
    );
  }

  issueCertificatePdf(file: File, studentNumber: string): Observable<{
    status: string;
    studentName: string;
    studentNumber: string;
    walletAddress: string;
    hash: string;
    transactionHash: string;
  }> {
    const form = new FormData();
    form.append('file', file);
    form.append('studentNumber', studentNumber);

    return this.http.post<{
      status: string;
      studentName: string;
      studentNumber: string;
      walletAddress: string;
      hash: string;
      transactionHash: string;
    }>(
      `${this.BASE_URL}/university/issue-pdf`,
      form
    );
  }
}
