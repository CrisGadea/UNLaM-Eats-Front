import { Routes } from '@angular/router';
import { authGuard, clientGuard, ownerGuard, deliveryGuard } from './core/guards/auth-guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'client',
    loadComponent: () => import('./features/client/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'owner',
    loadComponent: () => import('./features/owner/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'delivery',
    loadComponent: () => import('./features/delivery/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/producto-list/producto-list')
                            .then(m => m.ProductoListComponent)
  },
  { 
    path: 'productos/nuevo', 
    loadComponent: () => import('./pages/producto-form/producto-form') 
                            .then(m => m.ProductoForm) 
  },
  { 
    path: 'productos/editar/:id', 
    loadComponent: () => import('./pages/producto-form/producto-form')
                            .then(m => m.ProductoForm) 
  },
  {
    path: 'restaurantes/:id',
    loadComponent: () => import('./features/restaurantes/detail/detail').then(m => m.RestauranteDetailComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent)
  },
  {
    path: 'tracking/:id',
    loadComponent: () => import('./features/tracking/tracking').then(m => m.TrackingComponent)
  },
  {
    path: 'payment-result',
    loadComponent: () => import('./pages/payment-result/payment-result.component').then(m => m.PaymentResultComponent)
  },
  {
    path: 'payment-history',
    loadComponent: () => import('./pages/payment-history/payment-history.component').then(m => m.PaymentHistoryComponent)
  },
  {
    path: 'role',
    loadComponent: () => import('./features/role/role').then(m => m.RoleComponent)
  },
  { path: '**', redirectTo: '' }
];
