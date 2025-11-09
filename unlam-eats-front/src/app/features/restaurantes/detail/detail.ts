import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { RestaurantesService, Restaurant } from '../../../core/services/restaurantes.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-restaurante-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CurrencyPipe],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class RestauranteDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantes = inject(RestaurantesService);
  public readonly cart = inject(CartService);

  restaurant?: Restaurant;
  menu: any[] = [];
  loading = true;
  error = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurantes.getById(id).subscribe({
      next: (r) => {
        this.restaurant = r;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el restaurante';
        this.loading = false;
      }
    });
    this.restaurantes.getMenu(id).subscribe({
      next: (items) => (this.menu = items),
      error: () => {}
    });
  }

  addToCart(item: any) {
    if (!this.restaurant) return;
    this.cart.add({
      restaurantId: this.restaurant.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  }
}
