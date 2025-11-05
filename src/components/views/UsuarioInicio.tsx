import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, Clock, TrendingUp } from 'lucide-react';
import { libros, prestamos } from '../../data/mockData';

export function UsuarioInicio({ userId }: { userId: string }) {
  const userPrestamos = prestamos.filter(p => p.usuario_id === userId);
  const prestamosActivos = userPrestamos.filter(p => p.estado === 'activo').length;
  const prestamosPendientes = userPrestamos.filter(p => p.estado === 'pendiente').length;
  const librosDisponibles = libros.filter(l => l.cantidad_disponible > 0).length;

  const stats = [
    {
      title: 'Préstamos Activos',
      value: prestamosActivos,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Solicitudes Pendientes',
      value: prestamosPendientes,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Libros Disponibles',
      value: librosDisponibles,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total de Libros',
      value: libros.length,
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  const recentPrestamos = userPrestamos.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Bienvenido a la Biblioteca</h2>
        <p className="text-gray-600">Gestiona tus préstamos y explora nuestro catálogo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPrestamos.length > 0 ? (
            <div className="space-y-3">
              {recentPrestamos.map((prestamo) => {
                const libro = libros.find(l => l.id === prestamo.libro_id);
                return (
                  <div key={prestamo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{libro?.titulo}</p>
                      <p className="text-sm text-gray-600">
                        {prestamo.estado === 'activo' && `Devolución: ${prestamo.fecha_devolucion_esperada}`}
                        {prestamo.estado === 'pendiente' && 'Esperando aprobación'}
                        {prestamo.estado === 'devuelto' && `Devuelto el ${prestamo.fecha_devolucion_real}`}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        prestamo.estado === 'activo' ? 'bg-green-100 text-green-700' :
                        prestamo.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {prestamo.estado.charAt(0).toUpperCase() + prestamo.estado.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
