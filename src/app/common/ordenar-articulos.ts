import { Articulo } from './interfaces';

function fechaLanzamientoMs(a: Articulo): number {
  const base = a.fechaLanzamiento;
  if (base == null || base === '') return 0;
  const t = new Date(base).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function ordenarPorFechaLanzamientoDesc(articulos: Articulo[]): Articulo[] {
  return [...articulos].sort(
    (a, b) => fechaLanzamientoMs(b) - fechaLanzamientoMs(a)
  );
}
