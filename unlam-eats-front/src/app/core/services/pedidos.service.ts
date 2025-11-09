import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CreateOrderItemDto {
  menuItemId: number;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerId: string;
  restaurantId: number;
  items: CreateOrderItemDto[];
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/pedidos`;

  createFromCart(dto: CreateOrderDto) {
    return this.http.post(`${this.base}/from-cart`, dto);
  }
}
