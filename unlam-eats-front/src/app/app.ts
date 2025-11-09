import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RepartosList } from './components/repartos-list/repartos-list';
import { RepartoForm } from './components/reparto-form/reparto-form';
import { DatePipe, CommonModule } from '@angular/common'; // <-- 1. Importa DatePipe y CommonModule

@Component({
  selector: 'app-root',
  standalone: true, // <-- 2. Asegúrate de que esto esté
  imports: [
    CommonModule, // <-- 3. Importa CommonModule (para pipes/directivas base)
    RouterOutlet,
    RepartosList,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [ DatePipe ] // <-- 4. Añade DatePipe a los providers
})
export class App {
  protected readonly title = signal('unlam-eats-front');
}
