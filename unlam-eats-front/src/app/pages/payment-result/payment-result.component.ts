import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, RouterLink, NgSwitchDefault],
  template: `
    <div class="container">
      <div class="result-card" *ngIf="!loading">
        <div [ngSwitch]="status" class="result-content">
                    <div *ngSwitchCase="'success'" class="success">
            <div class="icon">✅</div>
            <h1>¡Pago Exitoso!</h1>
            <p class="message">Tu pago fue procesado correctamente.</p>
            <div class="details" *ngIf="payment">
              <div class="detail-item">
                <span class="label">Número de pedido:</span>
                <span class="value">#{{ payment.orderId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Monto:</span>
                <span class="value">{{ formatAmount(payment.amountCents) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value status-badge success">{{ payment.status }}</span>
              </div>
            </div>
            <div class="actions">
              <a [routerLink]="['/tracking', orderId]" class="btn btn-primary">
                Ver Estado del Pedido
              </a>
              <a routerLink="/" class="btn btn-secondary">
                Volver al Inicio
              </a>
            </div>
          </div>

          <!-- PENDING -->
          <div *ngSwitchCase="'pending'" class="pending">
            <div class="icon">⏳</div>
            <h1>Pago Pendiente</h1>
            <p class="message">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
            <div class="details" *ngIf="payment">
              <div class="detail-item">
                <span class="label">Número de pedido:</span>
                <span class="value">#{{ payment.orderId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value status-badge pending">{{ payment.status }}</span>
              </div>
            </div>
            <div class="actions">
              <a [routerLink]="['/tracking', orderId]" class="btn btn-primary">
                Ver Estado del Pedido
              </a>
              <a routerLink="/" class="btn btn-secondary">
                Volver al Inicio
              </a>
            </div>
          </div>

          <!-- FAILURE -->
          <div *ngSwitchCase="'failure'" class="failure">
            <div class="icon">❌</div>
            <h1>Pago Rechazado</h1>
            <p class="message">No pudimos procesar tu pago. Por favor, intenta nuevamente.</p>
            <div class="details" *ngIf="payment">
              <div class="detail-item">
                <span class="label">Número de pedido:</span>
                <span class="value">#{{ payment.orderId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value status-badge failed">{{ payment.status }}</span>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn-primary" (click)="retryPayment()">
                Reintentar Pago
              </button>
              <a routerLink="/" class="btn btn-secondary">
                Volver al Inicio
              </a>
            </div>
          </div>
          <div *ngSwitchDefault class="unknown">
            <div class="icon">❓</div>
            <h1>Estado Desconocido</h1>
            <p class="message">No pudimos determinar el estado de tu pago.</p>
            <div class="actions">
              <a routerLink="/" class="btn btn-primary">
                Volver al Inicio
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Verificando estado del pago...</p>
      </div>
      <div class="error-card" *ngIf="error">
        <div class="icon">⚠️</div>
        <h2>Error</h2>
        <p>{{ error }}</p>
        <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .result-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      text-align: center;
    }

    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .message {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .details {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    .value {
      font-weight: 600;
      color: #333;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .status-badge.success {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-badge.failed {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-card {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
    }

    .error-card .icon {
      font-size: 3rem;
    }

    .error-card h2 {
      color: #721c24;
      margin-bottom: 0.5rem;
    }

    .error-card p {
      color: #721c24;
      margin-bottom: 1.5rem;
    }

    .success .icon { color: #28a745; }
    .pending .icon { color: #ffc107; }
    .failure .icon { color: #dc3545; }

    @media (max-width: 600px) {
      .container {
        padding: 0.5rem;
      }
      
      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PaymentResultComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentsService = inject(PaymentsService);

  status: 'success' | 'pending' | 'failure' | 'unknown' = 'unknown';
  loading = true;
  error = '';
  payment: any = null;
  paymentId: number | null = null;
  orderId: number | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const statusParam = params['status'];
      const paymentIdParam = params['payment_id'];
      const externalRef = params['external_reference'];
      const mpStatus = params['collection_status'] || params['status'];

      if (mpStatus === 'approved') {
        this.status = 'success';
      } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
        this.status = 'pending';
      } else if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
        this.status = 'failure';
      } else if (statusParam) {
        this.status = statusParam as any;
      }

      if (paymentIdParam) {
        this.paymentId = parseInt(paymentIdParam, 10);
        this.loadPaymentDetails(this.paymentId);
      } else if (externalRef) {
        this.orderId = parseInt(externalRef, 10);
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  loadPaymentDetails(paymentId: number) {
    this.paymentsService.getPaymentById(paymentId).subscribe({
      next: (payment) => {
        this.payment = payment;
        this.orderId = payment.orderId;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payment:', err);
        this.error = 'No se pudo cargar la información del pago';
        this.loading = false;
      }
    });
  }

  formatAmount(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  retryPayment() {
    if (this.orderId) {
      this.router.navigate(['/checkout']);
    }
  }
}
