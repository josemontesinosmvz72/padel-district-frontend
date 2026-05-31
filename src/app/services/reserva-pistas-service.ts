import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ReservaPistasService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = 'https://padel-shop.onrender.com/api/v1/reservas';

  getPistas(): Observable<any> {
    return this.http.get<any>(this.urlBase + '/pistas');
  }

  crearReserva(idPista: string, body: { fecha: string; horaInicio: string; horaFin: string }): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    return this.http.post<any>(this.urlBase + '/reservar/' + idPista, body, {
      headers: { 'x-token': token },
    });
  }

  cancelarReserva(idReserva: string): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    return this.http.patch<any>(this.urlBase + '/cancelar/' + idReserva, {}, {
      headers: { 'x-token': token },
    });
  }

  getMisReservas(): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    return this.http.get<any>(this.urlBase + '/mis-reservas', {
      headers: { 'x-token': token },
    });
  }
}
