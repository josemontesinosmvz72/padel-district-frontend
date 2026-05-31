import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticuloPadelService } from '../../../services/articulo-padel-service';
import { Articulo } from '../../../common/interfaces';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../services/cart-service';
import { ToastService } from '../../../services/toast-service';

@Component({
  selector: 'app-padel-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './padel-detail.html',
  styleUrl: './padel-detail.css',
})
export class PadelDetail implements OnInit {
  @Input('id') palaId!: number;
  private readonly articuloService: ArticuloPadelService = inject(ArticuloPadelService);
  private readonly cartService: CartService = inject(CartService);
  private readonly toast: ToastService = inject(ToastService);
  pala!: Articulo;

  ngOnInit() {
    this.loadPala();
  }

  private loadPala() {
    this.articuloService.getArticulo(this.palaId).subscribe ({
      next: palas => {
        this.pala = palas.articulo;
      },
      error: err => {
        console.error(err);
      }
    }
  )}

  addToCart(pala: Articulo) {
    this.cartService.addToCart(pala);
    this.toast.show('"' + pala.nombre + '" añadido al carrito', { label: 'Ir al carrito', route: '/carrito' });
  }
}