import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { libros, usuarios, prestamos, autores } from '../../data/mockData';

export function BibliotecarioInicio() {
  const totalLibros = libros.length;
  const totalUsuarios = usuarios.filter(u => u.role === 'usuario').length;
  const prestamosPendientes = prestamos.filter(p => p.estado === 'pendiente').length;
  const prestamosActivos = prestamos.filter(p => p.estado === 'activo').length;
  const librosDisponibles = libros.filter(l => l.cantidad_disponible > 0).length;

  const stats = [
    {
      title: 'Total Libros',
      value: totalLibros,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Usuarios Registrados',
      value: totalUsuarios,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Solicitudes Pendientes',
      value: prestamosPendientes,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Préstamos Activos',
      value: prestamosActivos,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Libros Disponibles',
      value: librosDisponibles,
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
    {
      title: 'Total Autores',
      value: autores.length,
      icon: Users,
      color: 'bg-pink-500',
    },
  ];

  const solicitudesPendientes = prestamos
    .filter(p => p.estado === 'pendiente')
    .slice(0, 5)
    .map(prestamo => ({
      ...prestamo,
      usuario: usuarios.find(u => u.id === prestamo.usuario_id),
      libro: libros.find(l => l.id === prestamo.libro_id),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Panel de Administración</h2>
        <p className="text-gray-600">Gestión completa del sistema bibliotecario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            {solicitudesPendientes.length > 0 ? (
              <div className="space-y-3">
                {solicitudesPendientes.map((item) => (
                  <div key={item.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.libro?.titulo}</p>
                        <p className="text-sm text-gray-600">Usuario: {item.usuario?.nombre}</p>
                        <p className="text-sm text-gray-500">Fecha: {item.fecha_prestamo}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay solicitudes pendientes</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Libros más Prestados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {libros.slice(0, 5).map((libro, index) => {
                const prestamosCount = prestamos.filter(p => p.libro_id === libro.id).length;
                return (
                  <div key={libro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{libro.titulo}</p>
                        <p className="text-sm text-gray-600">{prestamosCount} préstamos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {libro.cantidad_disponible}/{libro.cantidad_total} disponibles
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
