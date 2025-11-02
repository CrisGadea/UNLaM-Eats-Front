import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Reparto  {
  id: number;
  idPedido: number;
  idRepartidor: number;
  direccionEntrega: string;
  estado:string;
  fechaAsignacion:string;
  fechaEntrega?:string | null;
  observaciones?:string | null;

}

@Injectable({
  providedIn: 'root',
})
export class RepartosService {
  private baseUrl = 'http://localhost:8003/api/reparto';


  constructor(private http: HttpClient) {}

  getAll(): Observable<Reparto[]> {
    return this.http.get<Reparto[]>(this.baseUrl);
  }

  getById(id:number): Observable<Reparto> {
    return this.http.get<Reparto>(`${this.baseUrl}/${id}`);
  }

  create(reparto:Reparto): Observable<Reparto> {
    return this.http.post<Reparto>(this.baseUrl, reparto);
  }

  update(id:number, reparto:Reparto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, reparto);
  }

  delete(id:number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

 asignarRepartidor(idReparto: number, idRepartidor: number): Observable<Reparto> {
    return this.http.post<Reparto>(`${this.baseUrl}/asignar`, { idReparto, idRepartidor });
  }
}
