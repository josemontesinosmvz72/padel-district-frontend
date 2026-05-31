import { Component, WritableSignal, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../services/cart-service';
import { LoginModalService } from '../../../../services/login-modal-service';


@Component({
  selector: 'app-navbar-logged',
  imports: [RouterLink],
  templateUrl: './navbar-logged.html',
  styleUrl: './navbar-logged.css',
})
export class NavbarLogged {
  private readonly cartService: CartService = inject(CartService);
  private readonly router: Router = inject(Router);
  private readonly loginModal = inject(LoginModalService);
  readonly authService = inject(AuthService);
  cartItemsTotal = this.cartService.cartTotalItems;
  searchTerm: WritableSignal<string> = signal<string>('');

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    const url = this.router.url.split('?')[0];
    if (url.startsWith('/categoria/') || url.startsWith('/subcategoria/')) {
      this.router.navigate([], {
        queryParams: { q: value || null },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['/categoria', 'todos'], {
        queryParams: { q: value || null },
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  openLoginModal(): void {
    this.loginModal.open();
  }
}
