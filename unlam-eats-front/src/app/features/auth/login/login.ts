import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(AuthStore);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  loading = false;
  error = '';

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const payload = this.form.value as { email: string; password: string };
    this.auth.login(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.store.setToken(res.token);
        this.store.setUser(res.user);
        const role = res.user.role;
        const target = role === 'cliente' ? '/client' : role === 'dueno' ? '/owner' : '/delivery';
        this.router.navigate([target]);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo iniciar sesión. Verificá tus datos e intentá nuevamente.';
      }
    });
  }
}

