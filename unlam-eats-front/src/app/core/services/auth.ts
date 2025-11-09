import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient;
  private baseUrl = environment.apiBaseUrl;

  constructor(http: HttpClient) {
    this.http = http;
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<{ token: string; user: { id: string; email: string; role: 'cliente'|'dueno'|'repartidor' } }>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: any) {
    return this.http.post<{ id: string; email: string; role: 'cliente'|'dueno'|'repartidor' }>(`${this.baseUrl}/auth/register`, payload);
  }
}
