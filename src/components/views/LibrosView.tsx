import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { libros, autores, editoriales, categorias, generos } from '../../data/mockData';
import { Libro } from '../../types';

interface LibrosViewProps {
  role: 'usuario' | 'bibliotecario';
  onRequestLoan?: (libroId: string) => void;
}

export function LibrosView({ role, onRequestLoan }: LibrosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterGenero, setFilterGenero] = useState('all');
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('view');

  const [formData, setFormData] = useState<Partial<Libro>>({
    titulo: '',
    isbn: '',
    año_publicacion: new Date().getFullYear(),
    cantidad_disponible: 0,
    cantidad_total: 0,
    autor_id: '',
    editorial_id: '',
    categoria_id: '',
    genero_id: '',
  });

  const filteredLibros = libros.filter(libro => {
    const matchesSearch = libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autores.find(a => a.id === libro.autor_id)?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'all' || libro.categoria_id === filterCategoria;
    const matchesGenero = filterGenero === 'all' || libro.genero_id === filterGenero;
    return matchesSearch && matchesCategoria && matchesGenero;
  });

  const handleOpenDialog = (mode: 'add' | 'edit' | 'view', libro?: Libro) => {
    setFormMode(mode);
    if (libro) {
      setSelectedLibro(libro);
      setFormData(libro);
    } else {
      setFormData({
        titulo: '',
        isbn: '',
        año_publicacion: new Date().getFullYear(),
        cantidad_disponible: 0,
        cantidad_total: 0,
        autor_id: '',
        editorial_id: '',
        categoria_id: '',
        genero_id: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este libro?')) {
      console.log('Deleting libro:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl mb-2">Catálogo de Libros</h2>
          <p className="text-gray-600">
            {role === 'usuario' ? 'Explora y solicita libros' : 'Gestión completa del catálogo'}
          </p>
        </div>
        {role === 'bibliotecario' && (
          <Button onClick={() => handleOpenDialog('add')}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Libro
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterGenero} onValueChange={setFilterGenero}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los géneros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los géneros</SelectItem>
                {generos.map(gen => (
                  <SelectItem key={gen.id} value={gen.id}>{gen.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibros.map(libro => {
          const autor = autores.find(a => a.id === libro.autor_id);
          const editorial = editoriales.find(e => e.id === libro.editorial_id);
          const categoria = categorias.find(c => c.id === libro.categoria_id);
          const genero = generos.find(g => g.id === libro.genero_id);
          const disponible = libro.cantidad_disponible > 0;

          return (
            <Card key={libro.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{libro.titulo}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{autor?.nombre}</p>
                  </div>
                  <Badge variant={disponible ? 'default' : 'secondary'}>
                    {disponible ? 'Disponible' : 'No disponible'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Editorial:</span> {editorial?.nombre}</p>
                  <p><span className="text-gray-600">Año:</span> {libro.año_publicacion}</p>
                  <p><span className="text-gray-600">Categoría:</span> {categoria?.nombre}</p>
                  <p><span className="text-gray-600">Género:</span> {genero?.nombre}</p>
                  <p><span className="text-gray-600">ISBN:</span> {libro.isbn}</p>
                  <p><span className="text-gray-600">Disponibles:</span> {libro.cantidad_disponible} de {libro.cantidad_total}</p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {role === 'usuario' ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleOpenDialog('view', libro)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!disponible}
                        onClick={() => onRequestLoan?.(libro.id)}
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Solicitar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog('view', libro)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog('edit', libro)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(libro.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog for Add/Edit/View */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'add' && 'Agregar Nuevo Libro'}
              {formMode === 'edit' && 'Editar Libro'}
              {formMode === 'view' && 'Detalles del Libro'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'view' 
                ? 'Información completa del libro' 
                : 'Complete los campos requeridos'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                disabled={formMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label>ISBN</Label>
              <Input
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                disabled={formMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label>Año de Publicación</Label>
              <Input
                type="number"
                value={formData.año_publicacion}
                onChange={(e) => setFormData({ ...formData, año_publicacion: parseInt(e.target.value) })}
                disabled={formMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label>Autor</Label>
              <Select 
                value={formData.autor_id} 
                onValueChange={(value) => setFormData({ ...formData, autor_id: value })}
                disabled={formMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {autores.map(autor => (
                    <SelectItem key={autor.id} value={autor.id}>{autor.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Editorial</Label>
              <Select 
                value={formData.editorial_id} 
                onValueChange={(value) => setFormData({ ...formData, editorial_id: value })}
                disabled={formMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editoriales.map(editorial => (
                    <SelectItem key={editorial.id} value={editorial.id}>{editorial.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select 
                value={formData.categoria_id} 
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                disabled={formMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria.id} value={categoria.id}>{categoria.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Género</Label>
              <Select 
                value={formData.genero_id} 
                onValueChange={(value) => setFormData({ ...formData, genero_id: value })}
                disabled={formMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generos.map(genero => (
                    <SelectItem key={genero.id} value={genero.id}>{genero.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad Total</Label>
              <Input
                type="number"
                value={formData.cantidad_total}
                onChange={(e) => setFormData({ ...formData, cantidad_total: parseInt(e.target.value) })}
                disabled={formMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label>Cantidad Disponible</Label>
              <Input
                type="number"
                value={formData.cantidad_disponible}
                onChange={(e) => setFormData({ ...formData, cantidad_disponible: parseInt(e.target.value) })}
                disabled={formMode === 'view'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {formMode === 'view' ? 'Cerrar' : 'Cancelar'}
            </Button>
            {formMode !== 'view' && (
              <Button onClick={handleSave}>Guardar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
