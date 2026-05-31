import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Articulo } from '../../../common/interfaces';

@Component({
  selector: 'app-filtros-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './filtros-sidebar.html',
  styleUrl: './filtros-sidebar.css',
})
export class FiltrosSidebarComponent {

  articulos = input<Articulo[]>([]);
  categoria = input<string>('');
  subcategoria = input<string>('');

  filtroMarcasChange = output<string[]>();
  filtroSubcategoriasChange = output<string[]>();
  filtroPesosChange = output<string[]>();
  filtroTallasChange = output<string[]>();

  marcasDisponibles = computed(() => this.valoresUnicos(this.articulos(), 'marca'));
  subcategoriasDisponibles = computed(() => this.valoresUnicos(this.articulos(), 'subcategoria'));
  pesosDisponibles = computed(() => this.valoresUnicos(this.articulos(), 'peso'));
  tallasDisponibles = computed(() => this.ordenarTallas(this.valoresUnicos(this.articulos(), 'talla')));
  mostrarFiltrosPalas = computed(() => this.categoria().toLowerCase() === 'palas');
  mostrarFiltroTallas = computed(() => {
    const cat = this.categoria().toLowerCase();
    const sub = this.subcategoria().toLowerCase();
    return sub === 'camisetas' || cat === 'calzado';
  });

  private marcasSeleccionadas = signal<Set<string>>(new Set());
  private subcategoriasSeleccionadas = signal<Set<string>>(new Set());
  private pesosSeleccionados = signal<Set<string>>(new Set());
  private tallasSeleccionadas = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      this.articulos();
      this.marcasSeleccionadas.set(new Set());
      this.subcategoriasSeleccionadas.set(new Set());
      this.pesosSeleccionados.set(new Set());
      this.tallasSeleccionadas.set(new Set());
    });
  }

  isMarcaSeleccionada(marca: string): boolean {
    return this.marcasSeleccionadas().has(marca);
  }

  isSubcategoriaSeleccionada(subcategoria: string): boolean {
    return this.subcategoriasSeleccionadas().has(subcategoria);
  }

  isPesoSeleccionado(peso: string): boolean {
    return this.pesosSeleccionados().has(peso);
  }

  isTallaSeleccionada(talla: string): boolean {
    return this.tallasSeleccionadas().has(talla);
  }

  toggleMarca(marca: string): void {
    const seleccion = new Set(this.marcasSeleccionadas());
    if (seleccion.has(marca)) {
      seleccion.delete(marca);
    } else {
      seleccion.add(marca);
    }
    this.marcasSeleccionadas.set(seleccion);
    this.filtroMarcasChange.emit([...seleccion]);
  }

  toggleSubcategoria(subcategoria: string): void {
    const seleccion = new Set(this.subcategoriasSeleccionadas());
    if (seleccion.has(subcategoria)) {
      seleccion.delete(subcategoria);
    } else {
      seleccion.add(subcategoria);
    }
    this.subcategoriasSeleccionadas.set(seleccion);
    this.filtroSubcategoriasChange.emit([...seleccion]);
  }

  togglePeso(peso: string): void {
    const seleccion = new Set(this.pesosSeleccionados());
    if (seleccion.has(peso)) {
      seleccion.delete(peso);
    } else {
      seleccion.add(peso);
    }
    this.pesosSeleccionados.set(seleccion);
    this.filtroPesosChange.emit([...seleccion]);
  }

  toggleTalla(talla: string): void {
    const seleccion = new Set(this.tallasSeleccionadas());
    if (seleccion.has(talla)) {
      seleccion.delete(talla);
    } else {
      seleccion.add(talla);
    }
    this.tallasSeleccionadas.set(seleccion);
    this.filtroTallasChange.emit([...seleccion]);
  }

  formatEtiqueta(valor: string): string {
    return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
  }

  private valoresUnicos(
    articulos: Articulo[],
    campo: 'marca' | 'subcategoria' | 'peso' | 'talla'
  ): string[] {
    const valores = new Set<string>();
    for (const a of articulos) {
      const valor = a[campo];
      if (valor) {
        valores.add(valor);
      }
    }
    return [...valores].sort((a, b) =>
      a.localeCompare(b, 'es', { numeric: true })
    );
  }

  private ordenarTallas(tallas: string[]): string[] {
    const orden = ['xs', 's', 'm', 'l', 'xl'];
    return [...tallas].sort((a, b) => {
      const ia = orden.indexOf(a.toLowerCase());
      const ib = orden.indexOf(b.toLowerCase());
      if (ia !== -1 && ib !== -1) {
        return ia - ib;
      }
      if (ia !== -1) {
        return -1;
      }
      if (ib !== -1) {
        return 1;
      }
      return a.localeCompare(b, 'es', { numeric: true });
    });
  }
}
