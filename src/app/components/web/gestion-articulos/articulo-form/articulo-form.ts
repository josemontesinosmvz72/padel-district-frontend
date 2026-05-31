import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ArticuloPadelService } from '../../../../services/articulo-padel-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidators } from '../../../../FormValidators';
import { Articulo } from '../../../../common/interfaces';
import { CreateArticuloModalService } from '../../../../services/create-articulo-modal';
import { ToastService } from '../../../../services/toast-service';

@Component({
  selector: 'app-articulo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './articulo-form.html',
})
export class ArticuloFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  private readonly articuloService: ArticuloPadelService = inject(ArticuloPadelService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly createArticuloModal = inject(CreateArticuloModalService);
  private readonly toast: ToastService = inject(ToastService);

  private editingArticulo: Articulo | null = null;

  formArticulo: FormGroup = this.formBuilder.group({
    nombre: ['', [FormValidators.required, FormValidators.minLength(4), FormValidators.notOnlyWhiteSpace]],
    imagen: ['', [FormValidators.required, FormValidators.minLength(7), FormValidators.notOnlyWhiteSpace]],
    descripcion: ['', [FormValidators.required, FormValidators.notOnlyWhiteSpace]],
    categoria: ['', [FormValidators.required, FormValidators.minLength(3), FormValidators.notOnlyWhiteSpace]],
    subcategoria: ['', [FormValidators.required, FormValidators.minLength(3), FormValidators.notOnlyWhiteSpace]],
    marca: ['', [FormValidators.required, FormValidators.minLength(2), FormValidators.notOnlyWhiteSpace]],
    precio: [0, [FormValidators.required, FormValidators.minNumber(0)]],
    stock: [0, [FormValidators.required, FormValidators.minNumber(0)]],
    precioRebajado: [0, [FormValidators.minNumber(0)]],
    color: ['', [FormValidators.required, FormValidators.notOnlyWhiteSpace]],
    fechaLanzamiento: ['', [FormValidators.requiredDate]],
  });

  loaded = signal(false);
  isEditing = signal(false);
  submitted = signal(false);

  get nombre(): any {
    return this.formArticulo.get('nombre');
  }

  get imagen(): any {
    return this.formArticulo.get('imagen');
  }

  get descripcion(): any {
    return this.formArticulo.get('descripcion');
  }

  get categoria(): any {
    return this.formArticulo.get('categoria');
  }

  get subcategoria(): any {
    return this.formArticulo.get('subcategoria');
  }

  get marca(): any {
    return this.formArticulo.get('marca');
  }

  get precio(): any {
    return this.formArticulo.get('precio');
  }

  get stock(): any {
    return this.formArticulo.get('stock');
  }

  get precioRebajado(): any {
    return this.formArticulo.get('precioRebajado');
  }

  get color(): any {
    return this.formArticulo.get('color');
  }

  get fechaLanzamiento(): any {
    return this.formArticulo.get('fechaLanzamiento');
  }

  ngOnInit() {
    this.editingArticulo = this.createArticuloModal.editingArticulo();
    this.isEditing.set(!!this.editingArticulo);

    if (this.editingArticulo) {
      const { _id, ...rest } = this.editingArticulo as any;
      this.formArticulo.patchValue(rest);
      this.formArticulo.markAsPristine();
    }
    this.loaded.set(true);
  }

  invalidFieldNames(): string[] {
    const controls = this.formArticulo.controls;
    return Object.keys(controls).filter((key) => controls[key]?.invalid);
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.formArticulo.invalid) {
      this.formArticulo.markAllAsTouched();
      return;
    }

    const articulo = this.formArticulo.getRawValue() as Articulo;

    if (this.editingArticulo?._id) {
      const payload: Articulo = { ...articulo, _id: this.editingArticulo._id } as Articulo;
      this.articuloService.updateArticulo(payload).subscribe({
        next: value => {
          this.toast.show(value.message);
          this.saved.emit();
        },
        error: err => {
          console.error(err);
          this.toast.show('Error al actualizar el artículo: ' + (err.error?.message || err.message), undefined, 5000, 'error');
        }
      });
      return;
    }

    this.articuloService.addArticulo(articulo).subscribe({
      next: value => {
        this.toast.show(value.message);
        this.saved.emit();
      },
      error: err => {
        console.error(err);
        this.toast.show('Error al crear el artículo: ' + (err.error?.message || err.message), undefined, 5000, 'error');
      }
    });
  }
}
