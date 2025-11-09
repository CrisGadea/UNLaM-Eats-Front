import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { RestaurantesService, Restaurant } from '../../../core/services/restaurantes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  restaurants: Restaurant[] = [];
  loading = true;
  error = '';

  constructor(private readonly restaurantes: RestaurantesService) {
    this.restaurantes.getAll().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los restaurantes';
        this.loading = false;
      }
    });
  }
}
