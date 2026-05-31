import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/structure/guest/navbar/navbar";
import { Footer } from "./components/structure/footer/footer";
import { NavbarLogged } from './components/structure/logged/navbar-logged/navbar-logged';
import { AuthService } from './services/auth-service';
import { LoginComponent } from './components/web/modal-login-register/modal-login-component/login-component';
import { RegisterComponent } from './components/web/modal-login-register/modal-register-component/register-component';
import { LoginModalService } from './services/login-modal-service';
import { RegisterModalService } from './services/register-modal-service';
import { CreateArticuloModalService } from './services/create-articulo-modal';
import { ArticuloFormComponent } from './components/web/gestion-articulos/articulo-form/articulo-form';
import { ToastComponent } from './components/web/toast-component/toast-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    NavbarLogged,
    LoginComponent,
    RegisterComponent,
    ArticuloFormComponent,
    ToastComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class App {
  protected readonly title = signal('padel-shop');
  protected readonly authService = inject(AuthService);
  protected readonly loginModal = inject(LoginModalService);
  protected readonly registerModal = inject(RegisterModalService);
  protected readonly createArticuloModal = inject(CreateArticuloModalService);
}
