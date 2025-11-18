import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <!-- Header fijo -->
    <header class="fixed inset-x-0 top-0 z-50 h-14 bg-[#00a896] text-white shadow">
      <div class="mx-auto max-w-6xl h-full px-4 flex items-center justify-between">
        <a routerLink="/" class="font-semibold tracking-wide text-white no-underline hover:no-underline">UNLaM Eats</a>
        <nav class="hidden sm:flex gap-4 text-sm">
          <a routerLink="/" routerLinkActive="font-semibold" [routerLinkActiveOptions]="{ exact: true }" class="text-white no-underline hover:no-underline transition-transform hover:scale-95 active:scale-90">Inicio</a>
          <a routerLink="/tracking" routerLinkActive="font-semibold" class="text-white no-underline hover:no-underline transition-transform hover:scale-95 active:scale-90">Tracking</a>
          <a routerLink="/client" routerLinkActive="font-semibold" class="text-white no-underline hover:no-underline transition-transform hover:scale-95 active:scale-90">Mis pedidos</a>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="mx-auto max-w-6xl px-4 pt-14 pb-16 min-h-screen bg-white">
      <router-outlet />
      <app-toast-container />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500">
        © {{ currentYear }} UNLaMEats - Todos los derechos reservados.
      </div>
    </footer>

    <!-- Bottom nav móvil -->
    <nav class="fixed inset-x-0 bottom-0 h-14 bg-white/95 backdrop-blur border-t border-gray-200 sm:hidden">
      <div class="h-full grid grid-cols-4 text-xs">
        <a routerLink="/" [routerLinkActive]="'text-[#00a896]'" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center justify-center gap-1">
          <span class="i">🏠</span>
          <span>Inicio</span>
        </a>
        <a routerLink="/client" [routerLinkActive]="'text-[#00a896]'" class="flex flex-col items-center justify-center gap-1">
          <span class="i">🧾</span>
          <span>Pedidos</span>
        </a>
        <a routerLink="/checkout" [routerLinkActive]="'text-[#00a896]'" class="flex flex-col items-center justify-center gap-1">
          <span class="i">🛒</span>
          <span>Carrito</span>
        </a>
        <a routerLink="/login" [routerLinkActive]="'text-[#00a896]'" class="flex flex-col items-center justify-center gap-1">
          <span class="i">👤</span>
          <span>Perfil</span>
        </a>
      </div>
    </nav>
  `,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('unlam-eats-front');
  protected readonly currentYear = new Date().getFullYear();
}
