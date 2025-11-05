import { Libro, Autor, Editorial, Categoria, Genero, Prestamo, User } from '../types';

export const autores: Autor[] = [
  { id: '1', nombre: 'Gabriel García Márquez', nacionalidad: 'Colombiano', fecha_nacimiento: '1927-03-06' },
  { id: '2', nombre: 'Isabel Allende', nacionalidad: 'Chilena', fecha_nacimiento: '1942-08-02' },
  { id: '3', nombre: 'Jorge Luis Borges', nacionalidad: 'Argentino', fecha_nacimiento: '1899-08-24' },
  { id: '4', nombre: 'Octavio Paz', nacionalidad: 'Mexicano', fecha_nacimiento: '1914-03-31' },
];

export const editoriales: Editorial[] = [
  { id: '1', nombre: 'Alfaguara', pais: 'España' },
  { id: '2', nombre: 'Planeta', pais: 'España' },
  { id: '3', nombre: 'Penguin Random House', pais: 'Estados Unidos' },
  { id: '4', nombre: 'Editorial Sudamericana', pais: 'Argentina' },
];

export const categorias: Categoria[] = [
  { id: '1', nombre: 'Ficción', descripcion: 'Obras literarias de ficción' },
  { id: '2', nombre: 'No ficción', descripcion: 'Obras basadas en hechos reales' },
  { id: '3', nombre: 'Referencia', descripcion: 'Libros de consulta y referencia' },
  { id: '4', nombre: 'Juvenil', descripcion: 'Literatura para jóvenes' },
];

export const generos: Genero[] = [
  { id: '1', nombre: 'Realismo Mágico' },
  { id: '2', nombre: 'Poesía' },
  { id: '3', nombre: 'Ensayo' },
  { id: '4', nombre: 'Cuento' },
  { id: '5', nombre: 'Novela' },
];

export const libros: Libro[] = [
  {
    id: '1',
    titulo: 'Cien años de soledad',
    isbn: '978-0307474728',
    año_publicacion: 1967,
    cantidad_disponible: 3,
    cantidad_total: 5,
    autor_id: '1',
    editorial_id: '1',
    categoria_id: '1',
    genero_id: '1',
  },
  {
    id: '2',
    titulo: 'La casa de los espíritus',
    isbn: '978-1501117015',
    año_publicacion: 1982,
    cantidad_disponible: 2,
    cantidad_total: 4,
    autor_id: '2',
    editorial_id: '2',
    categoria_id: '1',
    genero_id: '5',
  },
  {
    id: '3',
    titulo: 'Ficciones',
    isbn: '978-0802130303',
    año_publicacion: 1944,
    cantidad_disponible: 4,
    cantidad_total: 4,
    autor_id: '3',
    editorial_id: '3',
    categoria_id: '1',
    genero_id: '4',
  },
  {
    id: '4',
    titulo: 'El laberinto de la soledad',
    isbn: '978-0140188424',
    año_publicacion: 1950,
    cantidad_disponible: 0,
    cantidad_total: 3,
    autor_id: '4',
    editorial_id: '4',
    categoria_id: '2',
    genero_id: '3',
  },
  {
    id: '5',
    titulo: 'Crónica de una muerte anunciada',
    isbn: '978-1400034710',
    año_publicacion: 1981,
    cantidad_disponible: 1,
    cantidad_total: 3,
    autor_id: '1',
    editorial_id: '1',
    categoria_id: '1',
    genero_id: '5',
  },
];

export const usuarios: User[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+34 612 345 678',
    direccion: 'Calle Principal 123, Madrid',
    tipo_documento: 'DNI',
    numero_documento: '12345678A',
    role: 'usuario',
  },
  {
    id: '2',
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '+34 623 456 789',
    direccion: 'Avenida Central 456, Barcelona',
    tipo_documento: 'DNI',
    numero_documento: '23456789B',
    role: 'usuario',
  },
  {
    id: '3',
    nombre: 'Ana Bibliotecaria',
    email: 'ana.admin@biblioteca.com',
    telefono: '+34 634 567 890',
    direccion: 'Plaza Mayor 1, Madrid',
    tipo_documento: 'DNI',
    numero_documento: '34567890C',
    role: 'bibliotecario',
  },
];

export const prestamos: Prestamo[] = [
  {
    id: '1',
    usuario_id: '1',
    libro_id: '1',
    fecha_prestamo: '2025-10-15',
    fecha_devolucion_esperada: '2025-11-15',
    estado: 'activo',
  },
  {
    id: '2',
    usuario_id: '1',
    libro_id: '5',
    fecha_prestamo: '2025-10-20',
    fecha_devolucion_esperada: '2025-11-20',
    estado: 'pendiente',
  },
  {
    id: '3',
    usuario_id: '2',
    libro_id: '2',
    fecha_prestamo: '2025-09-10',
    fecha_devolucion_esperada: '2025-10-10',
    fecha_devolucion_real: '2025-10-08',
    estado: 'devuelto',
  },
  {
    id: '4',
    usuario_id: '2',
    libro_id: '4',
    fecha_prestamo: '2025-10-25',
    fecha_devolucion_esperada: '2025-11-25',
    estado: 'pendiente',
  },
];
