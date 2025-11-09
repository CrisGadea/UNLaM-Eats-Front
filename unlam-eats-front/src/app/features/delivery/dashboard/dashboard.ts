import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { PedidosService } from '../../../core/services/pedidos.service';
import { RealtimeOrdersService } from '../../../core/services/realtime-orders.service';
import { AuthStore } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  private readonly pedidos = inject(PedidosService);
  private readonly realtime = inject(RealtimeOrdersService);
  private readonly auth = inject(AuthStore);

  orders: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.refresh();
    this.initRealtime();
  }

  private courierId(): string | null { return this.auth.currentUser()?.id ?? null; }

  private async initRealtime() {
    await this.realtime.connect();
    effect(() => {
      const ev = this.realtime.orderAssigned();
      if (ev && ev.assignedCourierId === this.courierId()) this.refresh();
    });
    effect(() => {
      const ev = this.realtime.orderUpdated();
      if (ev && ev.assignedCourierId === this.courierId()) this.refresh();
    });
    effect(() => {
      const ev = this.realtime.statusChanged();
      if (ev) this.refresh();
    });
  }

  private refresh() {
    this.loading = true;
    const cid = this.courierId();
    this.pedidos.list().subscribe({
      next: (list) => {
        this.orders = list.filter(o => o.assignedCourierId === cid);
        this.loading = false;
      },
      error: () => { this.error = 'No se pudo cargar'; this.loading = false; }
    });
  }

  start(o: any) {
    this.pedidos.startDelivery(o.id).subscribe({ next: () => this.refresh() });
  }

  deliver(o: any) {
    this.pedidos.deliver(o.id).subscribe({ next: () => this.refresh() });
  }
}
