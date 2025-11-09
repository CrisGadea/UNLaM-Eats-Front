import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  isOpen: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/restaurantes`;

  getAll() {
    return this.http.get<Restaurant[]>(`${this.base}`);
  }

  getById(id: number) {
    return this.http.get<Restaurant>(`${this.base}/${id}`);
  }

  getMenu(id: number) {
    return this.http.get<any[]>(`${this.base}/${id}/menu`);
  }
}
