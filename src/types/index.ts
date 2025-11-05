export type UserRole = 'usuario' | 'bibliotecario';

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo_documento: string;
  numero_documento: string;
  role: UserRole;
}

export interface Libro {
  id: string;
  titulo: string;
  isbn: string;
  año_publicacion: number;
  cantidad_disponible: number;
  cantidad_total: number;
  autor_id: string;
  editorial_id: string;
  categoria_id: string;
  genero_id: string;
}

export interface Autor {
  id: string;
  nombre: string;
  nacionalidad: string;
  fecha_nacimiento: string;
}

export interface Editorial {
  id: string;
  nombre: string;
  pais: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Genero {
  id: string;
  nombre: string;
}

export interface Prestamo {
  id: string;
  usuario_id: string;
  libro_id: string;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
  fecha_devolucion_real?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'devuelto';
}
