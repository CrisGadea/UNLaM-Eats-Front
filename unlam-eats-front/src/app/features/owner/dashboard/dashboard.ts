import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../core/services/pedidos.service';
import { RealtimeOrdersService } from '../../../core/services/realtime-orders.service';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CurrencyPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  private readonly pedidos = inject(PedidosService);
  private readonly realtime = inject(RealtimeOrdersService);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  orders: any[] = [];
  loading = true;
  error = '';
  private get restaurantId() { return this.auth.currentUser()?.restaurantId ?? 1; }
  couriers: Array<{ id: string; name: string }> = [];
  selected: Record<number, string> = {};
  rejectNotes: Record<number, string> = {};

  constructor() {
    this.refresh();
    this.initRealtime();
    this.loadCouriers();
    effect(() => { this.auth.currentUser(); this.refresh(); });
  }

  private async initRealtime() {
    await this.realtime.connect();
    effect(() => {
      const ev = this.realtime.orderCreated();
      if (ev && ev.restaurantId === this.restaurantId) this.refresh();
    });
    effect(() => {
      const ev = this.realtime.orderUpdated();
      if (ev && ev.restaurantId === this.restaurantId) this.refresh();
    });
    effect(() => {
      const ev = this.realtime.statusChanged();
      if (ev) this.refresh();
    });
  }

  private refresh() {
    this.loading = true;
    this.pedidos.list({ restaurantId: this.restaurantId }).subscribe({
      next: (list) => { this.orders = list; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar'; this.loading = false; }
    });
  }

  private async loadCouriers() {
    try {
      this.couriers = await firstValueFrom(this.pedidos.getCouriers());
    } catch {}
  }

  accept(o: any) {
    this.pedidos.accept(o.id).subscribe({
      next: () => this.refresh(),
      error: () => alert('No se pudo aceptar el pedido')
    });
  }

  async assign(o: any) {
    const chosen = this.selected[o.id] || this.couriers[0]?.id;
    if (!chosen) return alert('Seleccione un repartidor');
    this.pedidos.assignCourier(o.id, chosen).subscribe({
      next: () => this.refresh(),
      error: () => alert('No se pudo asignar el repartidor. Verifique que el pedido esté En preparación.')
    });
  }

  reject(o: any) {
    const reason = (this.rejectNotes[o.id] || '').trim();
    if (!reason) { alert('Ingrese un motivo de rechazo'); return; }
    this.pedidos.reject(o.id, reason).subscribe({
      next: () => this.refresh(),
      error: () => alert('No se pudo rechazar el pedido')
    });
  }

  statusText(s: number): string {
    switch (s) {
      case 0: return 'Pedido Creado';
      case 2: return 'Pedido En preparación';
      case 3: return 'Repartidor Asignado';
      case 4: return 'En camino';
      case 5: return 'Entregado';
      case 6: return 'Rechazado';
      default: return String(s);
    }
  }

  goBack() { history.back(); }

  goHome() {
    const role = this.auth.currentUser()?.role;
    if (role === 'cliente') {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/role');
    }
  }

  clean() {
    this.orders = this.orders.filter(o => o.status !== 5 && o.status !== 6);
  }
}
