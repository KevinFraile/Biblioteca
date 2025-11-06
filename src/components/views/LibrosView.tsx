import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';

// --- Constante de la URL base de la API ---
const API_BASE_URL = 'http://localhost:3001';

// --- Tipos de Datos (Frontend) ---
// Estos tipos definen cómo usamos los datos en ESTE componente.
type Libro = {
  id: string; // Id_Libro
  titulo: string; // Nombre_Libro
  año_publicacion: number; // Ano_Publicacion_Libro
  cantidad_disponible: number; // Disponibilidad_Libro
  
  // IDs de relaciones (para los <select>)
  autor_id: string; 
  editorial_id: string;
  categoria_id: string;
  genero_id: string;

  // Nombres de relaciones (para mostrar en la tabla)
  autor_nombre: string;
  editorial_nombre: string;
  categoria_nombre: string;
  genero_nombre: string;
};

// Tipos para los catálogos (dropdowns)
type Autor = { id: string; nombre: string; };
type Editorial = { id: string; nombre: string; };
type Categoria = { id: string; nombre: string; };
type Genero = { id: string; nombre: string; };

// --- Props del Componente ---
interface LibrosViewProps {
  role: 'usuario' | 'bibliotecario';
  onRequestLoan?: (libroId: string) => void;
}

// --- Componente Principal ---
export function LibrosView({ role, onRequestLoan }: LibrosViewProps) {
  // --- Estados ---
  
  // Almacenes de datos de la API
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterGenero, setFilterGenero] = useState('all');
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('view');
  const [isDialogLoading, setIsDialogLoading] = useState(false); // <--- AÑADIR ESTE ESTADO

  // Estado del formulario (sin isbn ni cantidad_total, ya que no están en la API)
  const [formData, setFormData] = useState({
    titulo: '',
    año_publicacion: new Date().getFullYear(),
    cantidad_disponible: 0,
    autor_id: '',
    editorial_id: '',
    categoria_id: '',
    genero_id: '',
  });

  // --- Carga de Datos (useEffect) ---
  
  // Usamos useCallback para que esta función no se recree en cada render,
  // y podamos usarla como dependencia de useEffect.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cargamos todos los datos de la API en paralelo
      const [
        librosRes,
        autoresRes,
        editorialesRes,
        categoriasRes,
        generosRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/libros`),
        fetch(`${API_BASE_URL}/autores`),
        fetch(`${API_BASE_URL}/editoriales`),
        fetch(`${API_BASE_URL}/categorias`),
        fetch(`${API_BASE_URL}/generos`),
      ]);

      if (!librosRes.ok || !autoresRes.ok || !editorialesRes.ok || !categoriasRes.ok || !generosRes.ok) {
        throw new Error(`Error HTTP! No se pudieron cargar todos los datos.`);
      }

      // Parseamos los JSON
      const librosData = await librosRes.json();
      const autoresData = await autoresRes.json();
      const editorialesData = await editorialesRes.json();
      const categoriasData = await categoriasRes.json();
      const generosData = await generosRes.json();

      // Transformamos los datos de la API a los tipos del Frontend
      
      // Catálogos
      const transformedAutores: Autor[] = autoresData.map((a: any) => ({
        id: a.Id_Autor.toString(),
        nombre: `${a.Nombre_Autor} ${a.Apellido_Autor}`
      }));
      
      const transformedEditoriales: Editorial[] = editorialesData.map((e: any) => ({
        id: e.Id_Editorial.toString(),
        nombre: e.Nombre_Editorial
      }));

      const transformedCategorias: Categoria[] = categoriasData.map((c: any) => ({
        id: c.Id_Categoria.toString(),
        nombre: c.Nombre_Categoria
      }));

      const transformedGeneros: Genero[] = generosData.map((g: any) => ({
        id: g.Id_Genero.toString(),
        nombre: g.Nombre_Genero
      }));

      // Libros
      // La API /libros devuelve nombres (ej. Nombre_Autor) pero no IDs de autor.
      // ¡PERO! El formulario de edición necesita los IDs.
      // La API GET /libros/:id *SÍ* devuelve los IDs (ej. Id_Autor).
      // Para este caso, vamos a asumir que la API de /libros (GET ALL)
      // devuelve los IDs, ya que es la única forma de hacer el "edit" sin
      // una llamada extra por cada libro.
      
      // *** Importante: Tu API GET /libros debe devolver los IDs de las claves foráneas ***
      // Voy a asumir que tu API /libros (GET ALL) devuelve el resultado de /libros/:id
      // (el cual sí tenía los IDs). Si no es así, la API GET /libros necesita un ajuste.
      
      // Asumiendo que /libros devuelve IDs foráneos (ej. Id_Autor, Id_Genero_Libro)
      const transformedLibros: Libro[] = librosData.map((item: any) => {
        // Buscamos los nombres correspondientes en los catálogos que ya cargamos
        const autor = transformedAutores.find(a => a.id === (item.Id_Autor?.toString() || item.autor_id)); // El GET /libros debe devolver Id_Autor
        const editorial = transformedEditoriales.find(e => e.id === item.Id_Editorial_Libro?.toString());
        const categoria = transformedCategorias.find(c => c.id === item.Id_Categoria_Libro?.toString());
        const genero = transformedGeneros.find(g => g.id === item.Id_Genero_Libro?.toString());

        return {
          id: item.Id_Libro.toString(),
          titulo: item.Nombre_Libro,
          año_publicacion: item.Ano_Publicacion_Libro,
          cantidad_disponible: item.Disponibilidad_Libro,
          
          // IDs (asumiendo que vienen de la API)
          autor_id: item.Id_Autor?.toString() || '',
          editorial_id: item.Id_Editorial_Libro?.toString() || '',
          categoria_id: item.Id_Categoria_Libro?.toString() || '',
          genero_id: item.Id_Genero_Libro?.toString() || '',

          // Nombres (para mostrar)
          autor_nombre: autor?.nombre || (item.Nombre_Autor ? `${item.Nombre_Autor} ${item.Apellido_Autor}` : 'N/A'),
          editorial_nombre: editorial?.nombre || item.Nombre_Editorial || 'N/A',
          categoria_nombre: categoria?.nombre || item.Nombre_Categoria || 'N/A',
          genero_nombre: genero?.nombre || item.Nombre_Genero || 'N/A',
        };
      });

      // Guardamos todo en el estado
      setLibros(transformedLibros);
      setAutores(transformedAutores);
      setEditoriales(transformedEditoriales);
      setCategorias(transformedCategorias);
      setGeneros(transformedGeneros);

    } catch (err: any) {
      console.error("Error al traer los datos:", err);
      setError(err.message || 'Ocurrió un error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []); // El array vacío asegura que esta función se cree solo una vez

  // Efecto para cargar los datos la primera vez
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Usamos fetchData como dependencia


  // --- Lógica de Filtro ---
  const filteredLibros = libros.filter(libro => {
    const matchesSearch = libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor_nombre.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategoria = filterCategoria === 'all' || libro.categoria_id === filterCategoria;
    const matchesGenero = filterGenero === 'all' || libro.genero_id === filterGenero;
    
    return matchesSearch && matchesCategoria && matchesGenero;
  });

  // --- Manejadores de Eventos ---
  
  const handleOpenDialog = async (mode: 'add' | 'edit' | 'view', libro?: Libro) => {
    setFormMode(mode);
    setDialogOpen(true);

    if (mode === 'add') {
      // Resetea el formulario para 'add'
      setFormData({
        titulo: '',
        año_publicacion: new Date().getFullYear(),
        cantidad_disponible: 0,
        autor_id: '',
        editorial_id: '',
        categoria_id: '',
        genero_id: '',
      });
      setSelectedLibro(null);
      setIsDialogLoading(false); // No hay carga en 'add'
    } else if (libro) {
      // Modo 'edit' o 'view'. ¡Necesitamos los IDs!
      setSelectedLibro(libro);
      setIsDialogLoading(true); // Activar el loader del modal
      try {
        // Hacemos fetch a la API para obtener los datos COMPLETOS del libro
        const response = await fetch(`${API_BASE_URL}/libros/${libro.id}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar la información completa del libro.');
        }
        const fullBookData = await response.json();
        
        // Transformar datos de GET /libros/:id a formData
        setFormData({
          titulo: fullBookData.Nombre_Libro,
          año_publicacion: fullBookData.Ano_Publicacion_Libro,
          cantidad_disponible: fullBookData.Disponibilidad_Libro,
          autor_id: fullBookData.Id_Autor?.toString() || '',
          editorial_id: fullBookData.Id_Editorial_Libro?.toString() || '',
          categoria_id: fullBookData.Id_Categoria_Libro?.toString() || '',
          genero_id: fullBookData.Id_Genero_Libro?.toString() || '',
        });
        
      } catch (err: any) {
        console.error(err);
        alert(err.message);
        setDialogOpen(false); // Cerrar si falla
      } finally {
        setIsDialogLoading(false); // Ocultar el loader
      }
    }
  };

  /**
   * Manejador para GUARDAR (Crear o Editar)
   */
  const handleSave = async () => {
    const isEditMode = formMode === 'edit';
    
    // 1. Transformar datos del Formulario (Frontend) al formato de la API (Backend)
    const payload = {
      Nombre_Libro: formData.titulo,
      Ano_Publicacion_Libro: Number(formData.año_publicacion),
      Disponibilidad_Libro: Number(formData.cantidad_disponible),
      Id_Autor: formData.autor_id,
      Id_Editorial_Libro: formData.editorial_id,
      Id_Categoria_Libro: formData.categoria_id,
      Id_Genero_Libro: formData.genero_id,
    };
    
    // Validar payload
    if (!payload.Nombre_Libro || !payload.Id_Autor || !payload.Id_Editorial_Libro || !payload.Id_Categoria_Libro || !payload.Id_Genero_Libro) {
        alert("Por favor, complete todos los campos (Título, Autor, Editorial, Categoría y Género).");
        return;
    }

    // 2. Definir URL y Método
    const url = isEditMode
      ? `${API_BASE_URL}/libros/${selectedLibro?.id}`
      : `${API_BASE_URL}/libros`;
      
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      // 3. Enviar la petición
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status} al guardar el libro`);
      }

      // 4. Éxito: Cerrar modal y recargar los datos
      setDialogOpen(false);
      fetchData(); // Recargamos la lista de libros para mostrar los cambios
      
    } catch (err: any) {
      console.error('Error al guardar el libro:', err);
      setError(err.message);
      alert(`Error al guardar: ${err.message}`); // Mostramos un error
    }
  };

  /**
   * Manejador para ELIMINAR
   */
  const handleDelete = async (id: string) => {
    // Usamos window.confirm por simplicidad, idealmente sería un modal
    if (window.confirm('¿Está seguro de eliminar este libro? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/libros/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // Si la API devuelve un error (ej. 400 por clave foránea)
          if (response.status === 400) {
             const errorData = await response.text(); // El error de clave foránea es texto
             throw new Error(errorData);
          }
          throw new Error(`Error ${response.status} al eliminar el libro`);
        }

        // Éxito: Eliminamos el libro del estado local (actualización optimista)
        setLibros(libros.filter(l => l.id !== id));

      } catch (err: any) {
        console.error('Error al eliminar el libro:', err);
        setError(err.message);
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  // --- Renderizado Condicional ---
  if (isLoading) {
    return <div className="p-6 text-center">Cargando libros y catálogos...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">
      Error: {error}
    </div>;
  }

  // --- Renderizado Principal (JSX) ---
  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      
      {/* --- Cabecera --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Catálogo de Libros</h2>
          <p className="text-gray-600">
            {role === 'usuario' ? 'Explora y solicita libros' : 'Gestión completa del catálogo'}
          </p>
        </div>
        {role === 'bibliotecario' && (
          <button 
            onClick={() => handleOpenDialog('add')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Libro
          </button>
        )}
      </div>

      {/* --- Filtros --- */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <select 
              value={filterCategoria} 
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <select 
              value={filterGenero} 
              onChange={(e) => setFilterGenero(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los géneros</option>
              {generos.map(gen => (
                <option key={gen.id} value={gen.id}>{gen.nombre}</option>
              ))}
            </select> */}
          </div>
        </div>
      </div>

      {/* --- Rejilla de Libros --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibros.length > 0 ? (
          filteredLibros.map(libro => {
            const disponible = libro.cantidad_disponible > 0;
            return (
              <div key={libro.id} className="bg-white shadow rounded-lg hover:shadow-lg transition-shadow flex flex-col">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{libro.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {libro.autor_nombre}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 border-t border-gray-200 flex-grow">
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600 font-medium">Editorial:</span> {libro.editorial_nombre}</p>
                    <p><span className="text-gray-600 font-medium">Año:</span> {libro.año_publicacion}</p>
                    <p><span className="text-gray-600 font-medium">Categoría:</span> {libro.categoria_nombre}</p>
                    <p><span className="text-gray-600 font-medium">Género:</span> {libro.genero_nombre}</p>
                    <p><span className="text-gray-600 font-medium">Disponibles:</span> {libro.cantidad_disponible}</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4 border-t border-gray-200">
                  {role === 'usuario' ? (
                    <>
                      <button 
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        onClick={() => handleOpenDialog('view', libro)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </button>
                      
                      <button 
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm text-white ${
                          disponible ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!disponible}
                        onClick={() => onRequestLoan?.(libro.id)}
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Solicitar
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        title="Ver Detalles"
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                        onClick={() => handleOpenDialog('view', libro)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        title="Editar"
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-blue-600"
                        onClick={() => handleOpenDialog('edit', libro)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        title="Eliminar"
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        onClick={() => handleDelete(libro.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 md:col-span-2 lg:col-span-3 text-center">
            No se encontraron libros que coincidan con la búsqueda.
          </p>
        )}
      </div>

      {/* --- Modal (Formulario) --- */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setDialogOpen(false)} // Cierra al hacer clic fuera
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
          >
            {/* Cabecera del Modal */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold">
                {formMode === 'add' && 'Agregar Nuevo Libro'}
                {formMode === 'edit' && 'Editar Libro'}
                {formMode === 'view' && 'Detalles del Libro'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formMode === 'view' 
                  ? 'Información completa del libro' 
                  : 'Complete los campos requeridos'}
              </p>
            </div>
            
            {/* Contenido del Modal (Formulario) */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              {isDialogLoading ? (
                <div className="md:col-span-2 text-center p-8 text-gray-600">
                  Cargando datos del libro...
                </div>
              ) : (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Título (*)</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      disabled={formMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Autor (*)</label>
                <select 
                  value={formData.autor_id} 
                  onChange={(e) => setFormData({ ...formData, autor_id: e.target.value })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Seleccione un autor</option>
                  {autores.map(autor => (
                    <option key={autor.id} value={autor.id}>{autor.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Editorial (*)</label>
                <select 
                  value={formData.editorial_id} 
                  onChange={(e) => setFormData({ ...formData, editorial_id: e.target.value })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Seleccione una editorial</option>
                  {editoriales.map(editorial => (
                    <option key={editorial.id} value={editorial.id}>{editorial.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoría (*)</label>
                <select 
                  value={formData.categoria_id} 
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Género (*)</label>
                <select 
                  value={formData.genero_id} 
                  onChange={(e) => setFormData({ ...formData, genero_id: e.target.value })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Seleccione un género</option>
                  {generos.map(genero => (
                    <option key={genero.id} value={genero.id}>{genero.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Año de Publicación</label>
                <input
                  type="number"
                  value={formData.año_publicacion}
                  onChange={(e) => setFormData({ ...formData, año_publicacion: parseInt(e.target.value) })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cantidad Disponible</label>
                <input
                  type="number"
                  value={formData.cantidad_disponible}
                  onChange={(e) => setFormData({ ...formData, cantidad_disponible: parseInt(e.target.value) })}
                  disabled={formMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
                </>
              )}
            </div>

            {/* Pie del Modal */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setDialogOpen(false)}
              >
                {formMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {formMode !== 'view' && (
                <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  onClick={handleSave}
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}