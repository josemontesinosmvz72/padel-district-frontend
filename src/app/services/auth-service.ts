import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router"; import { catchError, Observable, tap, throwError } from "rxjs";


@Injectable({ providedIn: 'root' })

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = 'https://padel-shop.onrender.com/api/v1/users';

  #user = signal<any>(null);

  public user = this.#user.asReadonly();
  public isAuthenticated = computed(() => !!this.#user());
  constructor() {
    this.checkAuthStatus();

  } register(userDto: any):
    Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDto).pipe(
      tap((res: any) => this.setSession(res.token, res.usuario)),
      catchError(this.handleError)
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res: any) => this.setSession(res.token, res.usuario)),
      catchError(this.handleError)
    );
  }

  private setSession(token: string, usuario?: any) {
    localStorage.setItem('token', token);
    if (usuario != null) {
      this.#user.set(usuario);
    } else {
      this.checkAuthStatus();
    }
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return this.#user.set(null);
    this.http.get(`${this.baseUrl}/user-info`, {
      headers: { 'x-token': token }
    }).subscribe({
      next: (res: any) => this.#user.set(res.usuario),
      error: () => this.logout()
    });
  }

  setLoggedInUser(usuario: unknown): void {
    this.#user.set(usuario ?? null);
  }

  logout() {
    localStorage.removeItem('token');
    this.#user.set(null);
    this.router.navigate(['/inicio']);
  }
  private handleError(error: any) {
    const errorMessage = error.error?.message || 'Ocurrió un error inesperado';
    return throwError(() => new Error(errorMessage));
  }
}