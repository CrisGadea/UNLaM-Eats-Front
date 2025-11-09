import { Component, OnInit, inject } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})
export class ProductoListComponent implements OnInit {

  public productos$!: Observable<Producto[]>; 
  private productoService = inject(ProductoService); 

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productos$ = this.productoService.getProductos();
  }

  onEliminar(id: number): void {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => alert('Hubo un error al eliminar.')
      });
    }
  }

  onAgregar(): void {
    const nuevoProducto: Omit<Producto, 'id' | 'disponible'> = {
      nombre: `Producto Nuevo ${Math.floor(Math.random() * 100)}`,
      precio: 199.99,
      stock: 20,
      categoriaId: 1, 
      descripcion: 'Producto de prueba'
    };

    this.productoService.addProducto(nuevoProducto).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => alert('Hubo un error al crear.')
    });
  }
}