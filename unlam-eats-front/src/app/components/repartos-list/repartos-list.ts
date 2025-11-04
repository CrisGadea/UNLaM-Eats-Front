import { Component, OnInit } from '@angular/core';
import { RepartosService, Reparto } from '../../services/repartos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export enum EstadoReparto {
  PENDIENTE = 0,
  EN_CAMINO = 1,
  ENTREGADO = 3
}

@Component({
  selector: 'app-repartos-list',
  standalone: true,
  imports: [CommonModule, FormsModule ,HttpClientModule],
  templateUrl: './repartos-list.html',
  styleUrls: ['./repartos-list.css'],
})
export class RepartosList implements OnInit {
  repartos: Reparto[] = [];
  loading = false;
  error = '';
  EstadoReparto = EstadoReparto;


  constructor(private repartosService: RepartosService) { }

  ngOnInit(): void {
    this.cargarRepartos();
  }

  cargarRepartos(){
    this.loading = true;
    this.repartosService.getAll().subscribe({
        next: (data) =>{
          this.repartos = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = "Error al cargar los repartos";
          this.loading = false;
        }
    })
  }

  eliminarReparto(id: number){
    if(!confirm("Seguro que desea eliminar el reparto?")) return;

    this.repartosService.delete(id).subscribe({
      next: () => {
        this.cargarRepartos();
      },
      error: (error) => {
        alert("Error al eliminar el reparto");
      }
    })
  }

  asignarRepartidor(idReparto:number){
    const idRepartidor = Number(prompt('Ingrese el id del repartidor'));
    if(!idRepartidor) return;

    this.repartosService.asignarRepartidor(idReparto,idRepartidor).subscribe({
      next:() => {
        this.cargarRepartos();
      },
      error: (error) => {
        alert("Error al asignar el repartidor");
      }
    })
  }

 cambiarEstadoSelect(reparto: Reparto, nuevoEstadoString: string): void {
    if (!nuevoEstadoString) return;

    // Evitar actualizar si es el mismo estado
    if (nuevoEstadoString === this.getEstadoString(reparto.estado)) return;

    this.repartosService.cambiarEstado(reparto.id, nuevoEstadoString).subscribe({
      next: (repartoActualizado) => {
        reparto.estado = repartoActualizado.estado;
        reparto.fechaEntrega = repartoActualizado.fechaEntrega;
        alert(`Estado actualizado a ${this.getEstadoString(repartoActualizado.estado)}`);
      },
      error: (err) => {
        console.error('Error al cambiar el estado', err);
        alert('Error al cambiar el estado');
      }
    });
  }


 getEstadoString(estado: EstadoReparto): string {
    switch (estado) {
      case EstadoReparto.PENDIENTE: return 'PENDIENTE';
      case EstadoReparto.EN_CAMINO: return 'EN_CAMINO';
      case EstadoReparto.ENTREGADO: return 'ENTREGADO';
      default: return '';
    }
  }
}
