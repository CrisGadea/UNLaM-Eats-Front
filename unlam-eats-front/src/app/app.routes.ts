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
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/client/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'owner',
    canActivate: [authGuard, ownerGuard],
    loadComponent: () => import('./features/owner/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'delivery',
    canActivate: [authGuard, deliveryGuard],
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
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];