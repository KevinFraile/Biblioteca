import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Check, X, Eye, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { prestamos, libros, usuarios } from '../../data/mockData';
import { Prestamo } from '../../types';

interface PrestamosViewProps {
  role: 'usuario' | 'bibliotecario';
  userId?: string;
}

export function PrestamosView({ role, userId }: PrestamosViewProps) {
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userPrestamos = role === 'usuario' 
    ? prestamos.filter(p => p.usuario_id === userId)
    : prestamos;

  const pendientes = userPrestamos.filter(p => p.estado === 'pendiente');
  const activos = userPrestamos.filter(p => p.estado === 'activo');
  const historial = userPrestamos.filter(p => p.estado === 'devuelto' || p.estado === 'rechazado');

  const handleApprove = (id: string) => {
    console.log('Approving prestamo:', id);
  };

  const handleReject = (id: string) => {
    if (confirm('¿Está seguro de rechazar esta solicitud?')) {
      console.log('Rejecting prestamo:', id);
    }
  };

  const handleReturn = (id: string) => {
    if (confirm('¿Confirmar devolución del libro?')) {
      console.log('Returning prestamo:', id);
    }
  };

  const handleViewDetails = (prestamo: Prestamo) => {
    setSelectedPrestamo(prestamo);
    setDialogOpen(true);
  };

  const PrestamoRow = ({ prestamo }: { prestamo: Prestamo }) => {
    const libro = libros.find(l => l.id === prestamo.libro_id);
    const usuario = usuarios.find(u => u.id === prestamo.usuario_id);

    return (
      <TableRow>
        {role === 'bibliotecario' && (
          <TableCell>{usuario?.nombre}</TableCell>
        )}
        <TableCell>{libro?.titulo}</TableCell>
        <TableCell>{prestamo.fecha_prestamo}</TableCell>
        <TableCell>{prestamo.fecha_devolucion_esperada}</TableCell>
        {prestamo.fecha_devolucion_real && (
          <TableCell>{prestamo.fecha_devolucion_real}</TableCell>
        )}
        <TableCell>
          <Badge variant={
            prestamo.estado === 'activo' ? 'default' :
            prestamo.estado === 'pendiente' ? 'secondary' :
            prestamo.estado === 'devuelto' ? 'outline' :
            'destructive'
          }>
            {prestamo.estado.charAt(0).toUpperCase() + prestamo.estado.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewDetails(prestamo)}>
              <Eye className="h-4 w-4" />
            </Button>
            {role === 'bibliotecario' && prestamo.estado === 'pendiente' && (
              <>
                <Button size="sm" onClick={() => handleApprove(prestamo.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleReject(prestamo.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {prestamo.estado === 'activo' && (
              <Button variant="outline" size="sm" onClick={() => handleReturn(prestamo.id)}>
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
          {role === 'bibliotecario' && (
            <TabsTrigger value="pendientes">
              Pendientes ({pendientes.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="activos">
            Activos ({activos.length})
          </TabsTrigger>
          {role === 'usuario' && (
            <TabsTrigger value="pendientes">
              Pendientes ({pendientes.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="historial">
            Historial ({historial.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              {pendientes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {role === 'bibliotecario' && <TableHead>Usuario</TableHead>}
                      <TableHead>Libro</TableHead>
                      <TableHead>Fecha Solicitud</TableHead>
                      <TableHead>Devolución Esperada</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendientes.map(prestamo => (
                      <PrestamoRow key={prestamo.id} prestamo={prestamo} />
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay solicitudes pendientes</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                      <TableHead>Devolución Esperada</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activos.map(prestamo => (
                      <PrestamoRow key={prestamo.id} prestamo={prestamo} />
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
                      <TableHead>Devolución Esperada</TableHead>
                      <TableHead>Devolución Real</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map(prestamo => (
                      <PrestamoRow key={prestamo.id} prestamo={prestamo} />
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
                <p>{libros.find(l => l.id === selectedPrestamo.libro_id)?.titulo}</p>
              </div>
              {role === 'bibliotecario' && (
                <div>
                  <Label className="text-sm text-gray-600">Usuario</Label>
                  <p>{usuarios.find(u => u.id === selectedPrestamo.usuario_id)?.nombre}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-600">Fecha de Préstamo</Label>
                <p>{selectedPrestamo.fecha_prestamo}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Fecha de Devolución Esperada</Label>
                <p>{selectedPrestamo.fecha_devolucion_esperada}</p>
              </div>
              {selectedPrestamo.fecha_devolucion_real && (
                <div>
                  <Label className="text-sm text-gray-600">Fecha de Devolución Real</Label>
                  <p>{selectedPrestamo.fecha_devolucion_real}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-600">Estado</Label>
                <div className="mt-1">
                  <Badge variant={
                    selectedPrestamo.estado === 'activo' ? 'default' :
                    selectedPrestamo.estado === 'pendiente' ? 'secondary' :
                    selectedPrestamo.estado === 'devuelto' ? 'outline' :
                    'destructive'
                  }>
                    {selectedPrestamo.estado.charAt(0).toUpperCase() + selectedPrestamo.estado.slice(1)}
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
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
