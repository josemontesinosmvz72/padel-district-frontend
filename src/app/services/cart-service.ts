import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {CartItem} from '../common/interfaces';
import {CurrencyPipe} from '@angular/common';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  private cartItemsSignal: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  readonly cartItems = this.cartItemsSignal.asReadonly();

  readonly cartTotalPrice = computed (() => {
    return this.cartItems().reduce(
      (sum, cartItem) => sum + cartItem.precio * cartItem.quantity, 0
    );
  })

  readonly cartTotalItems = computed(() => {
    return this.cartItems().reduce(
      (sum, cartItem) => sum + cartItem.quantity, 0
    );
  })

  addToCart(item: Omit<CartItem, 'quantity'>) {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(i => i._id === item._id);

      if (existingItem) {
        return items.map(i => i._id === item._id ? {...i, quantity: i.quantity + 1} : i)
      } else {
        return [...items, {...item, quantity: 1}]
      }
    })
  }

  removeFromCart(itemId: string) {
    this.cartItemsSignal.update(items => items.filter(item => item._id !== itemId));

  }
  updateFromCart(itemId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    this.cartItemsSignal.update(items => {
      return items.map(item => item._id === itemId ? {...item, quantity: newQuantity} : item)
    });
  }

  clearCartItems(): void {
    this.cartItemsSignal.set([]);
  }
}
