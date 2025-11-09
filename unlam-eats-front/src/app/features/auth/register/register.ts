import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(AuthStore);
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    role: ['cliente', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]]
  });
  loading = false;
  error = '';

  submit() {
    const v = this.form.value as RegisterPayload;
    if (this.form.invalid || v.password !== v.confirm) return;
    this.loading = true;
    this.error = '';
    this.auth.register(v).subscribe({
      next: (res: { id: string; email: string; role: 'cliente'|'dueno'|'repartidor' }) => {
        this.loading = false;
        this.store.setUser(res);
        const role = res.role;
        const target = role === 'cliente' ? '/client' : role === 'dueno' ? '/owner' : '/delivery';
        this.router.navigate([target]);
      },
      error: (_err: unknown) => {
        this.loading = false;
        this.error = 'No se pudo crear la cuenta. Intentá nuevamente.';
      }
    });
  }
}
