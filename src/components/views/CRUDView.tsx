import { useState } from 'react';
// CORRECCIÓN: Se han actualizado las rutas de importación para usar el alias de ruta estándar
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface CRUDViewProps {
  title: string;
  description: string;
  data: any[];
  columns: { key: string; label: string }[];
  formFields: { key: string; label: string; type?: string }[];
  idKey: string; // Clave primaria (ej: Id_Autor, Id_Editorial)
  onAdd?: (data: any) => void;
  onEdit?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
}

export function CRUDView({
  title,
  description,
  data,
  columns,
  formFields,
  idKey, // Recibimos la clave primaria
  onAdd,
  onEdit,
  onDelete,
}: CRUDViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Estado para el diálogo de confirmación
  const [idToDelete, setIdToDelete] = useState<string | null>(null); // ID a eliminar
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const filteredData = data.filter(item => {
    const searchString = Object.values(item).join(' ').toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleOpenDialog = (mode: 'add' | 'edit', item?: any) => {
    setFormMode(mode);
    if (item) {
      setSelectedId(item[idKey]); // Usamos idKey
      setFormData(item);
    } else {
      setSelectedId(null);
      const initialData: any = {};
      formFields.forEach(field => {
        initialData[field.key] = '';
      });
      setFormData(initialData);
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    // Filtramos los campos vacíos que no sean '0' o 'false'
    const cleanFormData = { ...formData };
    formFields.forEach(field => {
      // Convertir números
      if (field.type === 'number') {
        cleanFormData[field.key] = parseFloat(cleanFormData[field.key]);
      }
      // Manejar campos opcionales (ej: Seg_Nom_Usuario)
      if (cleanFormData[field.key] === '') {
        cleanFormData[field.key] = null;
      }
    });

    if (formMode === 'add') {
      onAdd?.(cleanFormData);
    } else if (selectedId) {
      onEdit?.(selectedId, cleanFormData);
    }
    setDialogOpen(false);
  };

  // Abre el modal de confirmación
  const handleOpenDeleteConfirm = (id: string) => {
    setIdToDelete(id);
    setConfirmDeleteOpen(true);
  };

  // Ejecuta la eliminación
  const handleConfirmDelete = () => {
    if (idToDelete) {
      onDelete?.(idToDelete);
    }
    setConfirmDeleteOpen(false);
    setIdToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <Button onClick={() => handleOpenDialog('add')}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(item => (
                <TableRow key={item[idKey]}> {/* Usamos idKey */}
                  {columns.map(col => (
                    <TableCell key={col.key}>{item[col.key]}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog('edit', item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteConfirm(item[idKey])} // Usamos idKey
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <p className="text-gray-500 text-center py-8">No se encontraron registros</p>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para Agregar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'add' ? 'Agregar Nuevo' : 'Editar'} {title}
            </DialogTitle>
            <DialogDescription>
              Complete los campos requeridos
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map(field => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}