export interface ApiResponsePadel {
  status: boolean
  articulos: Articulo[]
  total: number
  totalPages: number
  currentPage: number
}

export interface ApiResponsePadelDetail {
  status: boolean
  articulo: Articulo
}

export interface Articulo {
  _id: string
  nombre: string
  imagen: string
  descripcion: string
  categoria: string
  subcategoria: string
  marca: string
  precio: number
  fechaLanzamiento: string
  color: string
  peso?: string
  stock: number
  createdAt: string
  updatedAt: string
  talla?: string
  precioRebajado: number
}

export interface CartItem  extends Articulo {
  quantity: number
}

export interface Usuario {
  _id: string
  username: string
  avatar: string
  email: string
  password: string
  role: 'ADMIN_ROLE' | 'USER_ROLE';
}

export interface Pista {
  _id: string;
  nombre: string;
  tipo: 'indoor' | 'outdoor';
  estado: 'libre' | 'reservada' | 'mantenimiento';
}

export interface Reserva {
  _id: string;
  pista: { _id: string; nombre: string };
  estado: 'activa' | 'cancelada';
}