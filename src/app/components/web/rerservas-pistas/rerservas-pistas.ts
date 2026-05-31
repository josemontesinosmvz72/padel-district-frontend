import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaPistasService } from '../../../services/reserva-pistas-service';
import { AuthService } from '../../../services/auth-service';
import { Pista, Reserva } from '../../../common/interfaces';

@Component({
  selector: 'app-rerservas-pistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rerservas-pistas.html',
  styleUrl: './rerservas-pistas.css',
})
export class RerservasPistas implements OnInit {
  private readonly reservaService = inject(ReservaPistasService);
  readonly authService = inject(AuthService);

  pistas: WritableSignal<Pista[]> = signal<Pista[]>([]);
  misReservas: WritableSignal<Reserva[]> = signal<Reserva[]>([]);
  mensajeReserva: WritableSignal<string> = signal('');
  pistaEnProceso: WritableSignal<string | null> = signal(null);

  ngOnInit() {
    this.loadPistas();
    if (this.authService.isAuthenticated()) {
      this.loadMisReservas();
    }
  }

  private loadPistas() {
    this.reservaService.getPistas().subscribe({
      next: (res) => this.pistas.set(res.pistas ?? []),
      error: (err) => console.error(err),
    });
  }

  private loadMisReservas() {
    this.reservaService.getMisReservas().subscribe({
      next: (res) => this.misReservas.set(
        (res.reservas ?? []).filter((r: Reserva) => r.estado === 'activa')
      ),
      error: () => this.misReservas.set([]),
    });
  }

  getReservaId(idPista: string): string | null {
    const reserva = this.misReservas().find(r => r.pista._id === idPista);
    return reserva?._id ?? null;
  }

  reservar(pista: Pista) {
    if (!this.authService.isAuthenticated()) {
      this.mensajeReserva.set('Debes iniciar sesión para reservar una pista.');
      return;
    }

    const body = {
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '10:00',
      horaFin: '11:00',
    };

    this.pistaEnProceso.set(pista._id);

    this.reservaService.crearReserva(pista._id, body).subscribe({
      next: () => { 
        this.mensajeReserva.set(`Pista "${pista.nombre}" reservada correctamente.`);
        this.pistaEnProceso.set(null);
        this.loadPistas();
        this.loadMisReservas();
      },
      error: (err) => {
        this.mensajeReserva.set(err.message || 'Error al reservar la pista.');
        this.pistaEnProceso.set(null);
      },
    });
  }

  cancelar(idReserva: string, nombrePista: string) {
    this.pistaEnProceso.set(idReserva);

    this.reservaService.cancelarReserva(idReserva).subscribe({
      next: () => {
        this.mensajeReserva.set(`Reserva de "${nombrePista}" cancelada correctamente.`);
        this.pistaEnProceso.set(null);
        this.loadPistas();
        this.loadMisReservas();
      },
      error: (err) => {
        this.mensajeReserva.set(err.message || 'Error al cancelar la reserva.');
        this.pistaEnProceso.set(null);
      },
    });
  }
}
