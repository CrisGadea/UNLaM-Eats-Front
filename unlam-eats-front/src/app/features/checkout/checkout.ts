import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthStore } from '../../core/state/auth-store.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CurrencyPipe],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  private readonly pedidos = inject(PedidosService);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  placing = false;
  error = '';
  successId: number | null = null;

  remove(itemId: number) {
    this.cart.remove(itemId);
  }

  async placeOrder() {
    this.error = '';
    if (this.cart.items().length === 0) {
      this.error = 'El carrito está vacío';
      return;
    }
    const restaurantId = this.cart.restaurantId();
    if (!restaurantId) {
      this.error = 'Carrito inválido';
      return;
    }
    const customerId = this.auth.currentUser()?.id ?? 'anon';

    const dto = {
      customerId,
      restaurantId,
      items: this.cart.items().map(i => ({
        menuItemId: i.menuItemId,
        nameSnapshot: i.name,
        priceSnapshot: i.price,
        quantity: i.quantity,
      }))
    };

    this.placing = true;
    this.pedidos.createFromCart(dto).subscribe({
      next: (res: any) => {
        this.successId = res?.id ?? null;
        this.cart.clear();
        this.placing = false;
      },
      error: () => {
        this.error = 'No se pudo crear el pedido';
        this.placing = false;
      }
    });
  }
}
