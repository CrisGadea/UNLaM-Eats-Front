import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private base = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  createPayment(payload: any, idempotencyKey?: string): Observable<any> {
    let headers = new HttpHeaders();
    if (idempotencyKey) headers = headers.set('idempotency-key', idempotencyKey);
    return this.http.post<any>(this.base, payload, { headers });
  }

  initiateCheckout(
    paymentId: number
  ): Observable<{ preferenceId: string; initPoint?: string; sandboxInitPoint?: string }> {
    return this.http.post<{ preferenceId: string; initPoint?: string; sandboxInitPoint?: string }>(
      `${this.base}/${paymentId}/checkout`,
      {}
    );
  }

  getPaymentById(id: number) {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  getPaymentsByUserId(userId: number, page = 1, limit = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users/${userId}?page=${page}&limit=${limit}`);
  }
}
