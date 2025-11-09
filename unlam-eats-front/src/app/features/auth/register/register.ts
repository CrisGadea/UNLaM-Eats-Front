import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
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
    const v = this.form.value as any;
    if (this.form.invalid || v.password !== v.confirm) return;
    this.loading = true;
    this.error = '';
    this.auth.register(v).subscribe({
      next: () => {
        this.loading = false;
        this.store.setUser({ id: 'temp', email: v.email, role: v.role });
        const target = v.role === 'cliente' ? '/client' : v.role === 'dueno' ? '/owner' : '/delivery';
        this.router.navigate([target]);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo crear la cuenta. Intentá nuevamente.';
      }
    });
  }
}
