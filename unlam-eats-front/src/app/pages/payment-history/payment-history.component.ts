import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentsService } from '../../core/services/payments.service';

interface Payment {
  id: number;
  orderId: number;
  userId: number;
  amountCents: number;
  currency: string;
  status: string;
  method: string;
  provider: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, CurrencyPipe, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <h1>Historial de Pagos</h1>
        <p class="subtitle">Revisa todos tus pagos realizados</p>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando pagos...</p>
      </div>

      <div class="error-message" *ngIf="error">
        <p>❌ {{ error }}</p>
        <button (click)="loadPayments()" class="btn-retry">Reintentar</button>
      </div>

      <div class="payments-list" *ngIf="!loading && !error">
        <div class="empty-state" *ngIf="payments.length === 0">
          <div class="empty-icon">💳</div>
          <h2>No hay pagos registrados</h2>
          <p>Aún no has realizado ningún pago</p>
        </div>

        <div class="payment-card" *ngFor="let payment of payments">
          <div class="payment-header">
            <div class="payment-info">
              <h3>Pedido #{{ payment.orderId }}</h3>
              <p class="payment-description">{{ payment.description }}</p>
            </div>
            <div class="payment-amount">
              <span class="amount">{{ formatAmount(payment.amountCents) }}</span>
              <span class="currency">{{ payment.currency }}</span>
            </div>
          </div>

          <div class="payment-details">
            <div class="detail-row">
              <span class="label">Estado:</span>
              <span [class]="'status status-' + payment.status">
                {{ getStatusLabel(payment.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Método:</span>
              <span>{{ getMethodLabel(payment.method) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Proveedor:</span>
              <span>{{ payment.provider }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fecha:</span>
              <span>{{ payment.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="payments.length > 0">
          <button 
            (click)="previousPage()" 
            [disabled]="currentPage === 1"
            class="btn-page">
            ← Anterior
          </button>
          <span class="page-info">Página {{ currentPage }}</span>
          <button 
            (click)="nextPage()" 
            [disabled]="payments.length < pageSize"
            class="btn-page">
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }

    .error-message p {
      color: #c33;
      margin-bottom: 1rem;
    }

    .btn-retry {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-retry:hover {
      background: #c82333;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #666;
    }

    .payments-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .payment-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: box-shadow 0.3s ease;
    }

    .payment-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .payment-info h3 {
      font-size: 1.25rem;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .payment-description {
      color: #666;
      font-size: 0.9rem;
    }

    .payment-amount {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .currency {
      font-size: 0.9rem;
      color: #666;
    }

    .payment-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-processing {
      background: #cfe2ff;
      color: #084298;
    }

    .status-completed, .status-success {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-failed, .status-rejected {
      background: #f8d7da;
      color: #842029;
    }

    .payment-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

    .btn-details {
      background: #007bff;
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .btn-details:hover {
      background: #0056b3;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1rem;
    }

    .btn-page {
      background: white;
      border: 1px solid #dee2e6;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-page:hover:not(:disabled) {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 500;
      color: #666;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .payment-header {
        flex-direction: column;
        gap: 1rem;
      }

      .payment-amount {
        align-items: flex-start;
      }

      .payment-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PaymentHistoryComponent implements OnInit {
  private readonly paymentsService = inject(PaymentsService);

  payments: Payment[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  pageSize = 10;
  userId = 4; // TODO: Obtener del servicio de autenticación

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.error = '';

    this.paymentsService.getPaymentsByUserId(this.userId, this.currentPage, this.pageSize)
      .subscribe({
        next: (payments) => {
          this.payments = payments;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading payments:', err);
          this.error = 'No se pudieron cargar los pagos. Por favor, intenta nuevamente.';
          this.loading = false;
        }
      });
  }

  formatAmount(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'completed': 'Completado',
      'success': 'Exitoso',
      'failed': 'Fallido',
      'rejected': 'Rechazado'
    };
    return labels[status] || status;
  }

  getMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'card': 'Tarjeta',
      'cash': 'Efectivo',
      'transfer': 'Transferencia'
    };
    return labels[method] || method;
  }

  nextPage() {
    this.currentPage++;
    this.loadPayments();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPayments();
    }
  }
}
