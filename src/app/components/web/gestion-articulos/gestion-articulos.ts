import { Component, OnInit, inject, signal } from '@angular/core';
import { ArticuloPadelService } from '../../../services/articulo-padel-service';
import { ApiResponsePadel, Articulo } from '../../../common/interfaces';
import { CommonModule } from '@angular/common';
import { CreateArticuloModalService } from '../../../services/create-articulo-modal';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteArticulo } from './modal-delete/modal-delete-articulo/modal-delete-articulo';

@Component({
  selector: 'app-gestion-articulos',
  imports: [CommonModule, NgbPaginationModule, ModalDeleteArticulo],
  templateUrl: './gestion-articulos.html',
  styleUrl: './gestion-articulos.css',
})
export class GestionArticulos implements OnInit {
  private readonly articuloService = inject(ArticuloPadelService);
  private readonly createArticuloModal = inject(CreateArticuloModalService);

  articulosList: Articulo[] = [];
  infoPagination!: ApiResponsePadel;
  currentPage: number = 1;
  pageSize: number = 20;
  showDeleteModal = signal(false);
  articuloToDelete = signal<string | null>(null);

  confirmDelete(id: string) {
    this.articuloToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  onDeleted() {
    this.showDeleteModal.set(false);
    this.articuloToDelete.set(null);
    this.loadArticulos();
  }

  onCancelled() {
    this.showDeleteModal.set(false);
    this.articuloToDelete.set(null);
  }

  ngOnInit(): void {
    this.loadArticulos();
  }

  private loadArticulos() {
    this.articuloService.getArticulosPaged(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.articulosList = res.articulos;
        this.infoPagination = res;
      },
      error: (err) => console.error(err)
    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.loadArticulos();
  }

  newArticulo() {
    this.createArticuloModal.open();
  }

  editArticulo(articulo: Articulo) {
    this.createArticuloModal.openForEdit(articulo);
  }
}
