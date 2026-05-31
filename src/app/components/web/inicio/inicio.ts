import { Component, inject, OnInit, computed, signal, WritableSignal } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticuloPadelService } from '../../../services/articulo-padel-service';
import { Articulo } from '../../../common/interfaces';
import { ordenarPorFechaLanzamientoDesc } from '../../../common/ordenar-articulos';
import { CartService } from '../../../services/cart-service';
import { ToastService } from '../../../services/toast-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private readonly articuloService: ArticuloPadelService = inject(ArticuloPadelService);
  private readonly cartService: CartService = inject(CartService);
  palasList: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  mochilasList: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  calzadoList: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  palasDestacadas = computed<Articulo[]>(() =>
    ordenarPorFechaLanzamientoDesc(this.palasList()).slice(0, 8)
  );
  private readonly toast: ToastService = inject(ToastService);

  ngOnInit() {
    this.loadPalas();
    this.loadMochilas();
    this.loadCalzado();
  }

  private loadPalas() {
    this.articuloService.getArticulosByCategoria('palas').subscribe({
      next: (palas) => {
        const articulos = palas.articulos;
        this.palasList.set(articulos);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Palas cargadas');
      }
    });
  }

  private loadMochilas() {
    this.articuloService.getArticulosByCategoria('mochilas').subscribe({
      next: (res) => {
        this.mochilasList.set(ordenarPorFechaLanzamientoDesc(res.articulos ?? []));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private loadCalzado() {
    this.articuloService.getArticulosByCategoria('calzado').subscribe({
      next: (res) => {
        this.calzadoList.set(ordenarPorFechaLanzamientoDesc(res.articulos ?? []));
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Calzado cargado');
      }
    });
  }
  addToCart(pala: Articulo) {
    this.cartService.addToCart(pala);
    this.toast.show('"' + pala.nombre + '" añadido al carrito', { label: 'Ir al carrito', route: '/cart-list' });
  }
}
