import { useState, useEffect } from 'react';
// CORRECCIÓN: Imports de UI actualizados
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Eye, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';

// Definimos la URL de la API
const API_URL = 'http://localhost:3001';

interface PrestamosViewProps {
  role: 'usuario' | 'bibliotecario';
  userId?: string; // Nota: La API GET /prestamos no devuelve Id_Usuario, por lo que este filtro no se puede aplicar actualmente.
}

// Función para obtener el estado derivado del préstamo
const getEstado = (prestamo: any) => {
  const hoy = new Date();
  const fechaEntrega = new Date(prestamo.Fecha_Entrega_Prestamo);

  if (prestamo.Fecha_Devolucion) {
    return { texto: 'Devuelto', variant: 'outline' as const };
  }
  if (fechaEntrega < hoy) {
    return { texto: 'Vencido', variant: 'destructive' as const };
  }
  return { texto: 'Activo', variant: 'default' as const };
};

export function PrestamosView({ role, userId }: PrestamosViewProps) {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [selectedPrestamo, setSelectedPrestamo] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmReturnOpen, setConfirmReturnOpen] = useState(false);
  const [idToReturn, setIdToReturn] = useState<string | null>(null);

  // --- Carga de Datos ---
  const fetchPrestamos = async () => {
    try {
      const response = await fetch(`${API_URL}/prestamos`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los préstamos');
      }
      const data = await response.json();
      setPrestamos(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  // --- Lógica de Acciones ---

  // Abrir diálogo de confirmación para devolver
  const handleOpenReturnConfirm = (id: string) => {
    setIdToReturn(id);
    setConfirmReturnOpen(true);
  };

  // Confirmar y ejecutar devolución
  const handleConfirmReturn = async () => {
    if (!idToReturn) return;

    const fechaDevolucion = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    try {
      const response = await fetch(`${API_URL}/prestamos/${idToReturn}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Fecha_Devolucion: fechaDevolucion }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el préstamo');
      }
      
      toast.success('Libro devuelto exitosamente');
      fetchPrestamos(); // Recargar la lista
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setConfirmReturnOpen(false);
      setIdToReturn(null);
    }
  };

  // Ver detalles
  const handleViewDetails = (prestamo: any) => {
    setSelectedPrestamo(prestamo);
    setDialogOpen(true);
  };

  // --- Filtrado de Datos ---
  // Nota: El filtro por userId no es posible porque la API GET /prestamos no devuelve el Id_Usuario en su respuesta.
  // const userPrestamos = role === 'usuario' 
  //   ? prestamos.filter(p => p.Id_Usuario === userId) // Esto no funcionará con la API actual
  //   : prestamos;
  
  // Mostramos todos los préstamos por ahora
  const userPrestamos = prestamos;

  const activos = userPrestamos.filter(p => p.Fecha_Devolucion === null);
  const historial = userPrestamos.filter(p => p.Fecha_Devolucion !== null);

  // --- Componente de Fila ---
  const PrestamoRow = ({ prestamo }: { prestamo: any }) => {
    const estado = getEstado(prestamo);
    const nombreUsuario = `${prestamo.Prim_Nom_Usuario} ${prestamo.Prim_Apelli_Usuario}`;

    return (
      <TableRow>
        {role === 'bibliotecario' && (
          <TableCell>{nombreUsuario}</TableCell>
        )}
        <TableCell>{prestamo.Nombre_Libro}</TableCell>
        <TableCell>{new Date(prestamo.Fecha_Prestamo).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(prestamo.Fecha_Entrega_Prestamo).toLocaleDateString()}</TableCell>
        {/* Columna extra para historial */}
        {historial.includes(prestamo) && (
          <TableCell>{new Date(prestamo.Fecha_Devolucion).toLocaleDateString()}</TableCell>
        )}
        <TableCell>
          <Badge variant={estado.variant}>
            {estado.texto}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewDetails(prestamo)}>
              <Eye className="h-4 w-4" />
            </Button>
            {/* Solo mostrar botón de devolver si está activo */}
            {prestamo.Fecha_Devolucion === null && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenReturnConfirm(prestamo.Id_Prestamo)}
                title={role === 'usuario' ? 'Registrar devolución' : 'Confirmar devolución'}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Devolver
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">
          {role === 'usuario' ? 'Mis Préstamos' : 'Gestión de Préstamos'}
        </h2>
        <p className="text-gray-600">
          {role === 'usuario' 
            ? 'Historial y estado de tus préstamos' 
            : 'Administración completa de préstamos'}
        </p>
      </div>

      <Tabs defaultValue="activos">
        <TabsList>
          {/* La API no soporta "pendientes", se elimina la pestaña */}
          <TabsTrigger value="activos">
            Activos ({activos.length})
          </TabsTrigger>
          <TabsTrigger value="historial">
            Historial ({historial.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Préstamos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              {activos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {role === 'bibliotecario' && <TableHead>Usuario</TableHead>}
                      <TableHead>Libro</TableHead>
                      <TableHead>Fecha Préstamo</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activos.map(prestamo => (
                      <PrestamoRow key={prestamo.Id_Prestamo} prestamo={prestamo} />
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay préstamos activos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Préstamos</CardTitle>
            </CardHeader>
            <CardContent>
              {historial.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {role === 'bibliotecario' && <TableHead>Usuario</TableHead>}
                      <TableHead>Libro</TableHead>
                      <TableHead>Fecha Préstamo</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Devolución Real</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map(prestamo => (
                      <PrestamoRow key={prestamo.Id_Prestamo} prestamo={prestamo} />
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay historial de préstamos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Préstamo</DialogTitle>
            <DialogDescription>Información completa del préstamo</DialogDescription>
          </DialogHeader>
          {selectedPrestamo && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Libro</Label>
                <p>{selectedPrestamo.Nombre_Libro}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Usuario</Label>
                <p>{`${selectedPrestamo.Prim_Nom_Usuario} ${selectedPrestamo.Prim_Apelli_Usuario}`}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Bibliotecario</Label>
                <p>{selectedPrestamo.Prim_Nom_Biblio || 'No asignado'}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Fecha de Préstamo</Label>
                <p>{new Date(selectedPrestamo.Fecha_Prestamo).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Fecha de Devolución Esperada</Label>
                <p>{new Date(selectedPrestamo.Fecha_Entrega_Prestamo).toLocaleDateString()}</p>
              </div>
              {selectedPrestamo.Fecha_Devolucion && (
                <div>
                  <Label className="text-sm text-gray-600">Fecha de Devolución Real</Label>
                  <p>{new Date(selectedPrestamo.Fecha_Devolucion).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-600">Estado</Label>
                <div className="mt-1">
                  <Badge variant={getEstado(selectedPrestamo).variant}>
                    {getEstado(selectedPrestamo).texto}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Return Dialog */}
      <Dialog open={confirmReturnOpen} onOpenChange={setConfirmReturnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Confirmar devolución?</DialogTitle>
            <DialogDescription>
              Esta acción registrará la devolución del libro. ¿Desea continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReturnOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmReturn}>
              Confirmar Devolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}