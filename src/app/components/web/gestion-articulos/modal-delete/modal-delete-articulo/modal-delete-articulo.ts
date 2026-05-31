import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { ArticuloPadelService } from '../../../../../services/articulo-padel-service';
import { ToastService } from '../../../../../services/toast-service';

@Component({
  selector: 'app-modal-delete-articulo',
  imports: [],
  templateUrl: './modal-delete-articulo.html',
})
export class ModalDeleteArticulo {
  private readonly articuloService = inject(ArticuloPadelService);
  private readonly toast = inject(ToastService);

  readonly articuloId = input.required<string>();

  @Output() readonly deleted = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();

  delete() {
    this.articuloService.deleteArticulo(this.articuloId()).subscribe({
      next: () => {
        this.toast.show('Artículo eliminado correctamente.');
        this.deleted.emit();
      },
      error: (err) => {
        this.toast.show('Error al eliminar el artículo.');
        console.error(err);
      }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
