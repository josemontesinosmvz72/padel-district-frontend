import { Component, OnInit, computed, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ArticuloPadelService } from '../../../services/articulo-padel-service';
import { ApiResponsePadel, Articulo } from '../../../common/interfaces';
import { ordenarPorFechaLanzamientoDesc } from '../../../common/ordenar-articulos';
import { CartService } from '../../../services/cart-service';
import { ToastService } from '../../../services/toast-service';
import { FiltrosSidebarComponent } from '../filtros-sidebar/filtros-sidebar';


@Component({
  selector: 'app-componente-articulos-navbar',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FiltrosSidebarComponent],
  templateUrl: './componente-articulos-navbar.html',
  styleUrl: './componente-articulos-navbar.css',
})
export class ComponenteArticulosNavbar implements OnInit {


  private readonly articuloService = inject(ArticuloPadelService);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService: CartService = inject(CartService);
  private readonly toast: ToastService = inject(ToastService);

  articulosList: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  tituloFiltro: WritableSignal<string> = signal('');
  esListadoCamisetas = signal(false);
  cargando = signal(false);
  navbarSearchTerm: WritableSignal<string> = signal('');
  articulosFiltrados: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  marcasFiltro: WritableSignal<string[]> = signal<string[]>([]);
  subcategoriasFiltro: WritableSignal<string[]> = signal<string[]>([]);
  pesosFiltro: WritableSignal<string[]> = signal<string[]>([]);
  tallasFiltro: WritableSignal<string[]> = signal<string[]>([]);
  categoriaActual: WritableSignal<string> = signal('');
  subcategoriaActual: WritableSignal<string> = signal('');

  tamanoPagina = signal(24);

  articulosMostrados = computed<Articulo[]>(() => {
    return this.articulosFiltrados().slice(0, this.tamanoPagina());
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.navbarSearchTerm.set((params.get('q') ?? '').trim());
      this.aplicarFiltros();
    });
    this.route.params.subscribe(params => {
      this.articulosList.set([]);
      this.marcasFiltro.set([]);
      this.subcategoriasFiltro.set([]);
      this.pesosFiltro.set([]);
      this.tallasFiltro.set([]);
      this.categoriaActual.set('');
      this.subcategoriaActual.set('');
      const sub = params['subcategoria'];
      this.esListadoCamisetas.set(
        typeof sub === 'string' && sub.toLowerCase() === 'camisetas'
      );
      if (params['categoria']) {
        this.categoriaActual.set(params['categoria']);
        this.tituloFiltro.set(this.formatTitulo(params['categoria']));
        if (params['categoria'] === 'todos') {
          this.loadAllArticulos();
        } else {
          this.loadByCategoria(params['categoria']);
        }
      } else if (params['subcategoria']) {
        this.subcategoriaActual.set(params['subcategoria']);
        this.tituloFiltro.set(this.formatTitulo(params['subcategoria']));
        this.loadBySubcategoria(params['subcategoria']);
      } else {
        this.tituloFiltro.set('');
      }
    });
  }

  private formatTitulo(valor: string): string {
    return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
  }

  private loadByCategoria(categoria: string) {
    this.cargando.set(true);
    this.articuloService.getArticulosByCategoria(categoria).subscribe({
      next: (response: ApiResponsePadel) => {
        const base = response?.articulos ?? [];
        const list =
          categoria === 'mochilas'
            ? ordenarPorFechaLanzamientoDesc(base)
            : base;
        this.articulosList.set(list);
        this.aplicarFiltros(list);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando categoría:', err);
        this.cargando.set(false);
      },
      complete: () => {
        console.log('Categoría cargada correctamente');
      }
    });
  }

  private loadBySubcategoria(subcategoria: string) {
    this.cargando.set(true);
    this.articuloService.getArticulosBySubcategoria(subcategoria).subscribe({
      next: (response: ApiResponsePadel) => {
        const list = response.articulos ?? [];
        this.articulosList.set(list);
        this.aplicarFiltros(list);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando subcategoría:', err);
        this.cargando.set(false);
      },
      complete: () => {
        console.log('Subcategoría cargada correctamente');
      }
    });
  }

  private loadAllArticulos() {
    this.cargando.set(true);
    this.articuloService.getAllArticulos().subscribe({
      next: (response: ApiResponsePadel) => {
        const list = response.articulos ?? [];
        this.articulosList.set(list);
        this.aplicarFiltros(list);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando todos los artículos:', err);
        this.cargando.set(false);
      },
    });
  }

  onFiltroMarcasChange(marcas: string[]): void {
    this.marcasFiltro.set(marcas);
    this.aplicarFiltros();
  }

  onFiltroSubcategoriasChange(subcategorias: string[]): void {
    this.subcategoriasFiltro.set(subcategorias);
    this.aplicarFiltros();
  }

  onFiltroPesosChange(pesos: string[]): void {
    this.pesosFiltro.set(pesos);
    this.aplicarFiltros();
  }

  onFiltroTallasChange(tallas: string[]): void {
    this.tallasFiltro.set(tallas);
    this.aplicarFiltros();
  }

  private aplicarFiltros(lista?: Articulo[]): void {
    const base = lista ?? this.articulosList();
    const marcas = this.marcasFiltro();
    const subcategorias = this.subcategoriasFiltro();
    const pesos = this.pesosFiltro();
    const tallas = this.tallasFiltro();
    const search = this.navbarSearchTerm().toLowerCase();

    let resultado = base;
    if (search) {
      resultado = resultado.filter((a) =>
        a.nombre.toLowerCase().includes(search) ||
        a.marca.toLowerCase().includes(search) ||
        a.descripcion.toLowerCase().includes(search)
      );
    }
    if (marcas.length > 0) {
      resultado = resultado.filter((a) => marcas.includes(a.marca));
    }
    if (subcategorias.length > 0) {
      resultado = resultado.filter((a) => subcategorias.includes(a.subcategoria));
    }
    if (pesos.length > 0) {
      resultado = resultado.filter((a) => a.peso != null && pesos.includes(a.peso));
    }
    if (tallas.length > 0) {
      resultado = resultado.filter((a) => a.talla != null && tallas.includes(a.talla));
    }
    this.articulosFiltrados.set(resultado);
  }

  addToCart(pala: Articulo) {
    this.cartService.addToCart(pala);
    this.toast.show('"' + pala.nombre + '" añadido al carrito', { label: 'Ir al carrito', route: '/cart-list' });
  }

  totalArticulos(): number {
    return this.articulosFiltrados().length;
  }

}
