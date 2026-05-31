import { Injectable, signal } from '@angular/core';
import { Articulo } from '../common/interfaces';

@Injectable({ providedIn: 'root' })
export class CreateArticuloModalService {
  readonly isOpen = signal(false);
  readonly editingArticulo = signal<Articulo | null>(null);

  open(): void {
    this.editingArticulo.set(null);
    this.isOpen.set(true);
  }

  openForEdit(articulo: Articulo): void {
    this.editingArticulo.set(articulo);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.editingArticulo.set(null);
  }
}