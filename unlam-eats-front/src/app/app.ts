import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RepartosList } from './components/repartos-list/repartos-list';
import { RepartoForm } from './components/reparto-form/reparto-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RepartosList, RepartoForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('unlam-eats-front');
}
