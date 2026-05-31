import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginModalService } from './login-modal-service';
import { Usuario } from '../common/interfaces';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  urlUser = 'https://padel-shop.onrender.com/api/v1/users';
  token: string = '';
  usuario!: Usuario;
  private readonly loginModal = inject(LoginModalService);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  registro(usuario: Usuario): Promise<any> {
    return new Promise(resolve => {
      this.http.post(`${this.urlUser}/register`,
        usuario).subscribe({
          next: this.promesaGuardaToken(resolve),
          error: () => resolve(false),
        });
    });
  }

  login(email: string, password: string) {
    const data = { email, password };
    return new Promise(resolve => {
      this.http.post(`${this.urlUser}/login`,
        data).subscribe({
          next: this.promesaGuardaToken(resolve),
          error: () => resolve(false),
        });
    });
  }

  async guardarToken(token: string) {
    this.token = token;
    await localStorage.setItem('token', token);
    await this.validaToken();
  }

  async cargarToken() {
    this.token = await localStorage.getItem('token') || '';
  }

  private promesaGuardaToken(resolve: (value: (PromiseLike<unknown>
    | unknown)) => void) {
    return async (resp: any) => {
      if (resp.status === true && resp.token) {
        await this.guardarToken(resp.token);
        resolve(true);
      }
      else {
        this.token = '';
        localStorage.clear();
        resolve(false);
      }
    };
  }

  async validaToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      void this.router.navigateByUrl('/inicio');
      this.loginModal.open();
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders ({
        'x-token': this.token
      });
      
      this.http.get(`${this.urlUser}/user-info`, { headers })
      .subscribe( (resp: any) => {
        console.log(resp);
        if(resp.status === true && resp.token) {
          this.usuario = resp.usuario;
          resolve(true);
        } else {
          void this.router.navigateByUrl('/inicio');
          this.loginModal.open();
          resolve(false);
        }
      })
    })
  }
}
