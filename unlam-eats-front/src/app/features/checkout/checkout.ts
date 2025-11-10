import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { PaymentsService } from '../../core/services/payments.service';
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
  private readonly payments = inject(PaymentsService);
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
      next: (orderRes: any) => {
        const orderId = orderRes?.id;
        if (!orderId) {
          this.error = 'No se pudo crear el pedido';
          this.placing = false;
          return;
        }
        
        this.successId = orderId;
        
        const totalCents = this.cart.total() * 100;
        const userId = parseInt(customerId, 10) || 0;
        const idempotencyKey = `order-${orderId}-${Date.now()}`;
        
        const paymentDto = {
          orderId,
          userId,
          amountCents: totalCents,
          currency: 'ARS',
          description: `Pedido #${orderId} - Restaurante ${restaurantId}`,
          method: 'card',
          provider: 'mercadopago'
        };
        
        this.payments.createPayment(paymentDto, idempotencyKey).subscribe({
          next: (payment: any) => {
            this.payments.initiateCheckout(payment.id).subscribe({
              next: (checkoutRes) => {
                this.cart.clear();
                this.placing = false;
                
                const initPoint = checkoutRes.initPoint ?? checkoutRes.sandboxInitPoint;
                if (initPoint) {
                  window.location.href = initPoint;
                } else {
                  this.router.navigate(['/tracking', orderId]);
                }
              },
              error: (err) => {
                console.error('Error al iniciar checkout:', err);
                this.error = 'No se pudo iniciar el pago. Pedido creado, intente pagar manualmente.';
                this.placing = false;
                this.router.navigate(['/tracking', orderId]);
              }
            });
          },
          error: (err) => {
            console.error('Error al crear pago:', err);
            this.error = 'No se pudo procesar el pago. Pedido creado.';
            this.placing = false;
            this.router.navigate(['/tracking', orderId]);
          }
        });
      },
      error: () => {
        this.error = 'No se pudo crear el pedido';
        this.placing = false;
      }
    });
  }
}
