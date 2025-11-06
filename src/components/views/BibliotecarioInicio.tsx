import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'; // Asumo que tienes estos componentes
import { BookOpen, Users, FileText, AlertCircle, TrendingUp, UserCheck } from 'lucide-react';

// --- Componentes UI Locales (Reemplazo de ../ui/card) ---
// Como no podemos importar '../ui/card', creamos versiones simples aquí.
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white shadow-lg rounded-lg ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 border-b border-gray-200 ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-xl font-bold ${className || ''}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className || ''}`}>
    {children}
  </div>
);
// --- Fin de Componentes UI Locales ---

// URL de la API
const API_BASE_URL = 'http://localhost:3001';

// Tipos de datos que esperamos de la API
type DashboardStats = {
  totalLibros: number;
  totalUsuarios: number;
  totalAutores: number;
  prestamosActivos: number;
  prestamosVencidos: number;
  librosDisponibles: number;
};

type PrestamoVencido = {
  Id_Prestamo: number;
  Fecha_Entrega_Prestamo: string;
  Prim_Nom_Usuario: string;
  Prim_Apelli_Usuario: string;
  Nombre_Libro: string;
};

type LibroMasPrestado = {
  Id_Libro: number;
  Nombre_Libro: string;
  Disponibilidad_Libro: number;
  total_prestamos: number;
};

export function BibliotecarioInicio() {
  // --- Estados para los datos de la API ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vencidos, setVencidos] = useState<PrestamoVencido[]>([]);
  const [masPrestados, setMasPrestados] = useState<LibroMasPrestado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Hacemos las 3 llamadas a la API en paralelo
        const [statsRes, vencidosRes, masPrestadosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/consultas/dashboard-stats`),
          fetch(`${API_BASE_URL}/consultas/vencidos-detalle`),
          fetch(`${API_BASE_URL}/consultas/mas-prestados`),
        ]);

        if (!statsRes.ok || !vencidosRes.ok || !masPrestadosRes.ok) {
          throw new Error('No se pudieron cargar todos los datos del dashboard');
        }

        // Parseamos los JSON
        const statsData = await statsRes.json();
        const vencidosData = await vencidosRes.json();
        const masPrestadosData = await masPrestadosRes.json();

        // Actualizamos el estado
        setStats(statsData);
        setVencidos(vencidosData);
        setMasPrestados(masPrestadosData);

      } catch (err: any) {
        console.error("Error al cargar el dashboard:", err);
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // El array vacío [] hace que se ejecute solo una vez al montar

  // --- Renderizado Condicional (Carga y Error) ---

  if (isLoading) {
    return <div className="p-6 text-center">Cargando panel de administración...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">
      Error al cargar el dashboard: {error}
    </div>;
  }
  
  if (!stats) {
     return <div className="p-6 text-center text-gray-600">No se pudieron cargar las estadísticas.</div>;
  }

  // --- Definición de las Tarjetas de Estadísticas ---
  // Ahora usamos los datos del estado 'stats'
  const statCards = [
    {
      title: 'Total Libros',
      value: stats.totalLibros,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Usuarios Registrados',
      value: stats.totalUsuarios,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Préstamos Vencidos', // <-- Título actualizado
      value: stats.prestamosVencidos,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Préstamos Activos',
      value: stats.prestamosActivos,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Ejemplares Disponibles', // <-- Título actualizado
      value: stats.librosDisponibles,
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
    {
      title: 'Total Autores',
      value: stats.totalAutores,
      icon: UserCheck, // <-- Icono cambiado
      color: 'bg-pink-500',
    },
  ];

  // --- Renderizado Principal ---
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Panel de Administración</h2>
        <p className="text-gray-600">Resumen del sistema bibliotecario</p>
      </div>

      {/* --- Tarjetas de Estadísticas --- */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      {/* --- Columnas de Listas --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Columna 1: Préstamos Vencidos */}
        <Card>
          <CardHeader>
            <CardTitle>Préstamos Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            {vencidos.length > 0 ? (
              <div className="space-y-3">
                {vencidos.map((item) => (
                  <div key={item.Id_Prestamo} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.Nombre_Libro}</p>
                        <p className="text-sm text-gray-600">Usuario: {item.Prim_Nom_Usuario} {item.Prim_Apelli_Usuario}</p>
                        <p className="text-sm text-gray-500">Venció el: {new Date(item.Fecha_Entrega_Prestamo).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-medium">
                        Vencido
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">¡Excelente! No hay préstamos vencidos.</p>
            )}
          </CardContent>
        </Card>

        {/* Columna 2: Libros más Prestados */}
        <Card>
          <CardHeader>
            <CardTitle>Libros más Prestados</CardTitle>
          </CardHeader>
          <CardContent>
            {masPrestados.length > 0 ? (
            <div className="space-y-3">
              {masPrestados.map((libro, index) => (
                <div key={libro.Id_Libro} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{libro.Nombre_Libro}</p>
                      <p className="text-sm text-gray-600">{libro.total_prestamos} préstamos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {libro.Disponibilidad_Libro} disponibles
                    </p>
                  </div>
                </div>
              ))}
            </div>
             ) : (
              <p className="text-gray-500 text-center py-8">Aún no hay datos de préstamos.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}