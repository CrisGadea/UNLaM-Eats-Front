import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { PedidosService } from '../../core/services/pedidos.service';
import { RealtimeOrdersService } from '../../core/services/realtime-orders.service';
import { AuthStore } from '../../core/state/auth-store.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './tracking.html'
})
export class TrackingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly pedidos = inject(PedidosService);
  private readonly realtime = inject(RealtimeOrdersService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);

  order: any = null;
  error = '';
  private orderId = 0;

  async ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.pedidos.getById(this.orderId).subscribe({
      next: (o) => (this.order = o),
      error: () => (this.error = 'No se pudo cargar el pedido')
    });
    await this.realtime.connect();
    // efectos reactivos sobre señales
    effect(() => {
      const p = this.realtime.statusChanged();
      if (p && p.id === this.orderId) {
        if (this.order) this.order.status = p.status;

        const statusLabel = this.statusText(p.status);
        let extra = '';
        switch (p.status) {
          case 0:
            extra = 'Tu pedido fue creado correctamente.';
            break;
          case 2:
            extra = 'El restaurante está preparando tu pedido.';
            break;
          case 3:
            extra = 'Se asignó un repartidor a tu pedido.';
            break;
          case 4:
            extra = 'Tu pedido ya está en camino.';
            break;
          case 5:
            extra = 'Su pedido fue entregado correctamente, que lo disfrute.';
            break;
          case 6:
            extra = 'Tu pedido fue rechazado. Podés ver el motivo en el detalle.';
            break;
          default:
            extra = '';
        }

        const message = extra
          ? `Estado actualizado: ${statusLabel}. ${extra}`
          : `Estado actualizado: ${statusLabel}.`;
        this.toast.show(message, 'info');
      }
    });

    effect(() => {
      const o = this.realtime.orderUpdated();
      if (o && o.id === this.orderId) this.order = o;
    });
  }

  ngOnDestroy(): void {}

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
}
