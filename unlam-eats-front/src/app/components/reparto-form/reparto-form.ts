import { Component, Output , EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reparto, RepartosService } from '../../services/repartos.service';
import { EstadoReparto } from '../repartos-list/repartos-list';

@Component({
  selector: 'app-reparto-form',
  standalone : true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reparto-form.html',
  styleUrl: './reparto-form.css',
})
export class RepartoForm {
    @Output() repartoCreado = new EventEmitter<Reparto>();


    nuevoReparto : Partial<Reparto> = {
    idPedido : 0,
    idRepartidor : 0,
    direccionEntrega : '',
    observaciones : '',
    estado: EstadoReparto.PENDIENTE,

  };
  EstadoReparto = EstadoReparto;

  constructor(private repartosService : RepartosService){}


  crearReparto(){
    if(!this.nuevoReparto.idPedido || !this.nuevoReparto.direccionEntrega){
      alert('Debe ingresar el ID del pedido y la dirección');
      return;
    }

    this.repartosService.create(this.nuevoReparto as Reparto).subscribe({
      next: (repartoCreado) => {
        this.repartoCreado.emit(repartoCreado); 
        alert('Reparto creado correctamente');
        this.nuevoReparto = {
          idPedido : 0,
          idRepartidor: 0,
          direccionEntrega:'',
          observaciones : '',
          estado:  EstadoReparto.PENDIENTE,
        };
      },
      error: (error) => {
        alert('Error al crear el reparto');
      }

    })



  }


  }


