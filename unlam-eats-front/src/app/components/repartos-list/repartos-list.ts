import { Component, OnInit } from '@angular/core';
import { RepartosService, Reparto } from '../../services/repartos.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-repartos-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './repartos-list.html',
  styleUrls: ['./repartos-list.css'],
})
export class RepartosList implements OnInit {
  repartos: Reparto[] = [];
  loading = false;
  error = '';

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

}
