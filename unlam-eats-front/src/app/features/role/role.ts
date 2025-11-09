import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStore, UserRole } from '../../core/state/auth-store.service';
import { PedidosService } from '../../core/services/pedidos.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './role.html'
})
export class RoleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly pedidos = inject(PedidosService);

  form = this.fb.group({
    role: ['cliente' as UserRole, Validators.required],
    id: ['cliente-1', Validators.required],
    name: ['Cliente Demo', Validators.required],
    email: ['demo@example.com', [Validators.required, Validators.email]],
    restaurantId: [1]
  });

  async submit() {
    if (this.form.invalid) return;
    const v = this.form.value as { role: UserRole; id: string; name: string; email: string; restaurantId?: number };

    // si es repartidor, registrarlo en backend mock
    if (v.role === 'repartidor') {
      try { await this.pedidos.addCourier({ id: v.id, name: v.name }).toPromise(); } catch {}
    }

    this.store.setUser({ id: v.id, email: v.email, role: v.role, name: v.name, restaurantId: v.role === 'dueno' ? (v.restaurantId ?? 1) : undefined });
    const target = v.role === 'cliente' ? '/' : v.role === 'dueno' ? '/owner' : '/delivery';
    this.router.navigate([target]);
  }
}
