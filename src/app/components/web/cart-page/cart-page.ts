import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  public readonly cartService: CartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  cartTotalPrice = this.cartService.cartTotalPrice;
}
