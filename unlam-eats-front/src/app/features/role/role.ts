import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStore, UserRole } from '../../core/state/auth-store.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './role.html'
})
export class RoleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly pedidos = inject(PedidosService);
  private readonly http = inject(HttpClient);

  form = this.fb.group({
    role: ['cliente' as UserRole, Validators.required],
    id: ['cliente-1', Validators.required],
    name: ['Cliente Demo', Validators.required],
    email: ['demo@example.com', [Validators.required, Validators.email]],
    restaurantId: [1, [Validators.min(1)]]
  });

  restaurants: Array<{ id: number; name: string }> = [];
  error = '';

  constructor() {
    // Cargar restaurantes para seleccionar cuando rol = dueño
    const root = environment.apiBaseUrl;
    this.http.get<Array<{ id: number; name: string }>>(`${root}/restaurantes`).subscribe({
      next: (list) => (this.restaurants = list || []),
      error: () => (this.restaurants = [])
    });

    // Ajustar defaults/validaciones según rol
    this.form.get('role')!.valueChanges.subscribe((role) => {
      const idCtrl = this.form.get('id')!;
      const restCtrl = this.form.get('restaurantId')!;
      if (role === 'cliente') {
        idCtrl.setValue('cliente-1');
        restCtrl.clearValidators();
        restCtrl.updateValueAndValidity();
      } else if (role === 'dueno') {
        idCtrl.setValue('dueno-1');
        restCtrl.setValidators([Validators.required, Validators.min(1)]);
        if (!restCtrl.value) restCtrl.setValue(1);
        restCtrl.updateValueAndValidity();
      } else if (role === 'repartidor') {
        idCtrl.setValue('courier-1');
        restCtrl.clearValidators();
        restCtrl.updateValueAndValidity();
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;
    const v = this.form.value as { role: UserRole; id: string; name: string; email: string; restaurantId?: number };

    // si es repartidor, registrarlo en backend mock
    if (v.role === 'repartidor') {
      try { await this.pedidos.addCourier({ id: v.id, name: v.name }).toPromise(); } catch (e) { /* ignore demo error */ }
    }

    this.store.setUser({ id: v.id, email: v.email, role: v.role, name: v.name, restaurantId: v.role === 'dueno' ? (v.restaurantId ?? 1) : undefined });
    const target = v.role === 'cliente' ? '/' : v.role === 'dueno' ? '/owner' : '/delivery';
    try {
      await this.router.navigate([target]);
    } catch (e) {
      this.error = 'No se pudo navegar. Intente nuevamente.';
    }
  }
}
