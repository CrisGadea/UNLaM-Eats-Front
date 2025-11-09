import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, UserRole } from '../state/auth-store.service';

const ensureRole = (role?: UserRole): boolean => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const isAuthed = store.isAuthenticated();
  if (!isAuthed) {
    router.navigate(['/login']);
    return false;
  }
  if (role && store.role !== role) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

export const authGuard: CanActivateFn = () => ensureRole();
export const clientGuard: CanActivateFn = () => ensureRole('cliente');
export const ownerGuard: CanActivateFn = () => ensureRole('dueno');
export const deliveryGuard: CanActivateFn = () => ensureRole('repartidor');
