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

  getById(id: number) {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  list(params?: { customerId?: string; restaurantId?: number }) {
    return this.http.get<any[]>(`${this.base}/`, { params: params as any });
  }

  accept(id: number) {
    return this.http.put(`${this.base}/${id}/accept`, {});
  }

  assignCourier(id: number, courierId: string) {
    return this.http.put(`${this.base}/${id}/assign-courier`, { courierId });
  }

  startDelivery(id: number) {
    return this.http.put(`${this.base}/${id}/start-delivery`, {});
  }

  deliver(id: number) {
    return this.http.put(`${this.base}/${id}/deliver`, {});
  }

  reject(id: number, reason: string) {
    return this.http.put(`${this.base}/${id}/reject`, {}, { params: { reason } });
  }

  getCouriers() {
    const root = environment.apiBaseUrl.replace(/\/api$/, '');
    return this.http.get<Array<{ id: string; name: string }>>(`${root}/api/repartidores`);
  }

  addCourier(courier: { id: string; name: string }) {
    const root = environment.apiBaseUrl.replace(/\/api$/, '');
    return this.http.post(`${root}/api/repartidores`, courier);
  }
}
