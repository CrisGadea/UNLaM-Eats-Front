import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto, ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoForm implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  public productForm!: FormGroup;
  
  public isEditMode = false;
  private productoId?: number;

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));

    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [1, Validators.required]
    });

    if (!this.productoId) {
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
      
      this.productoService.getProductoById(this.productoId).subscribe(producto => {
        if (producto) {
          this.productForm.patchValue(producto);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    
    const productoDatos = this.productForm.value as Producto;

    if (this.isEditMode && this.productoId) {
      productoDatos.id = this.productoId;
      this.productoService.updateProducto(this.productoId, productoDatos).subscribe({
        next: () => {
          alert('¡Producto actualizado!');
          this.router.navigate(['/productos']);
        },
        error: (err) => alert('Error al actualizar')
      });
      
    } else {
      this.productoService.addProducto(productoDatos).subscribe({
        next: () => {
          alert('¡Producto creado!');
          this.router.navigate(['/productos']);
        },
        error: (err) => alert('Error al crear')
      });
    }
  }
}