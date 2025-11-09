import { Component, OnInit } from '@angular/core';
import { RepartosService, Reparto } from '../../services/repartos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RepartoForm } from '../reparto-form/reparto-form';
import { FormatFechaPipe } from '../../pipes/format-fecha-pipe';

export enum EstadoReparto {
  PENDIENTE = 0,
  ASIGNADO = 2,
  ENTREGADO = 3
}

@Component({
  selector: 'app-repartos-list',
  standalone: true,
  imports: [CommonModule, FormsModule ,HttpClientModule, RepartoForm, FormatFechaPipe],
  templateUrl: './repartos-list.html',
  styleUrls: ['./repartos-list.css'],
})
export class RepartosList implements OnInit {
  repartos: Reparto[] = [];
  loading = false;
  error = '';
  EstadoReparto = EstadoReparto;
  mostrarModal = false;
  repartoSeleccionado: Reparto | null = null;


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
      next:(repartoActualizado) => {
        const index = this.repartos.findIndex(r => r.id === idReparto);
        if(index !== -1){
          this.repartos[index].idRepartidor = repartoActualizado.idRepartidor;
          this.repartos[index].estado =  EstadoReparto.ASIGNADO;
          this.repartos[index].fechaAsignacion = repartoActualizado.fechaAsignacion;
        }
        alert(`Repartidor asignado correctamente, al repartidor ${idRepartidor})`);


      },
      error: (error) => {
        alert("Error al asignar el repartidor");
      }
    })
  }

 cambiarEstadoSelect(reparto: Reparto, nuevoEstadoString: string): void {
    if (!nuevoEstadoString) return;

    let nuevoEstado: EstadoReparto;
    switch (nuevoEstadoString) {
      case 'PENDIENTE': nuevoEstado = EstadoReparto.PENDIENTE; break;
      case 'ASIGNADO': nuevoEstado = EstadoReparto.ASIGNADO; break;
      case 'ENTREGADO': nuevoEstado = EstadoReparto.ENTREGADO; break;
      default: console.error('Estado inválido:', nuevoEstadoString); return;
    }

    if (nuevoEstado === reparto.estado) return;

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
      case EstadoReparto.ASIGNADO: return 'ASIGNADO';
      case EstadoReparto.ENTREGADO: return 'ENTREGADO';
      default: return '';
    }
  }

  abrirModal(reparto?: Reparto) {
  this.repartoSeleccionado = reparto || null;
  this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  onRepartoCreado(nuevoReparto: Reparto) {
  this.cargarRepartos();
  this.cerrarModal();
}
}
