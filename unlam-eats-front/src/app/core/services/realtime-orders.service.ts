import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PedidosService } from './pedidos.service';

@Injectable({ providedIn: 'root' })
export class RealtimeOrdersService {
  private connection: any | null = null;

  orderCreated = signal<any | null>(null);
  orderUpdated = signal<any | null>(null);
  statusChanged = signal<{ id: number; status: number; at: string } | null>(null);
  orderAssigned = signal<any | null>(null);

  constructor(private pedidos: PedidosService) {}

  async connect() {
    if (this.connection) return;
    try {
      const root = environment.apiBaseUrl.replace(/\/api$/, '');
      const { HubConnectionBuilder, LogLevel } = await import('@microsoft/signalr');
      this.connection = new HubConnectionBuilder()
        .withUrl(`${root}/hubs/orders`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.connection.on('orderCreated', (order: any) => this.orderCreated.set(order));
      this.connection.on('orderUpdated', (order: any) => this.orderUpdated.set(order));
      this.connection.on('orderAssigned', (order: any) => this.orderAssigned.set(order));
      this.connection.on('statusChanged', (payload: any) => this.statusChanged.set(payload));

      await this.connection.start();
    } catch (e) {
      // si SignalR no está disponible, dejamos en null y el consumidor puede usar fallback (polling)
      this.connection = null;
    }
  }
}
