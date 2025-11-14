import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'; // Asumo que tienes estos componentes
import { BookOpen, Users, FileText, AlertCircle, TrendingUp, UserCheck, ChevronUp, ChevronDown } from 'lucide-react';

// --- Componentes UI Locales (Reemplazo de ../ui/card) ---
// --- ESTILO MODERNO Y COLORIDO ---
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  // Fondo blanco, esquinas redondeadas, sombra sutil
  <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  // Borde más sutil, padding adaptado
  <div className={`p-4 border-b border-gray-200 ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  // Título más suave
  <h3 className={`text-lg font-semibold text-gray-800 ${className || ''}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 ${className || ''}`}>
    {children}
  </div>
);
// --- Fin de Componentes UI Locales ---

// --- COMPONENTE: Gráfico Circular SVG (Pie Chart) ---
const PieChart = ({ data, title }: { data: LibroMasPrestado[], title: string }) => {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-4">No hay datos de {title} para mostrar.</p>;
  }
  // --- Lógica de Porcentaje (Calcula el total) ---
  const total = data.reduce((sum, item) => sum + item.total_prestamos, 0);
  let startAngle = 0;
  // Paleta de colores vibrante
  const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#A855F7', '#06B6D4'];

  const pieSlices = data.map((item, index) => {
    const sliceAngle = (item.total_prestamos / total) * 360;
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const x1 = 100 + 90 * Math.cos(startAngle * Math.PI / 180);
    const y1 = 100 + 90 * Math.sin(startAngle * Math.PI / 180);
    startAngle += sliceAngle;
    const x2 = 100 + 90 * Math.cos(startAngle * Math.PI / 180);
    const y2 = 100 + 90 * Math.sin(startAngle * Math.PI / 180);
    const d = [`M 100,100`, `L ${x1},${y1}`, `A 90,90 0 ${largeArcFlag} 1 ${x2},${y2}`, `Z`].join(' ');
    return {
      path: d,
      color: colors[index % colors.length],
      label: item.Nombre_Libro,
      value: item.total_prestamos,
      // --- Lógica de Porcentaje (Calcula porción) ---
      percentage: ((item.total_prestamos / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g transform="rotate(-90 100 100)">
          {pieSlices.map((slice, index) => (
            <path key={index} d={slice.path} fill={slice.color} />
          ))}
        </g>
      </svg>
      {/* --- Renderizado de Porcentaje --- */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
        {pieSlices.map((slice, index) => (
          <div key={index} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: slice.color }}></span>
            {slice.label} ({slice.percentage}%)
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE: Gráfico de Barras Verticales SVG (Multicolor) ---
const VerticalBarChart = ({ data, title }: { data: LibroMasPrestado[], title: string }) => {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-4">No hay datos de {title} para mostrar.</p>;
  }

  const chartWidth = 350;
  const chartHeight = 200;
  const padding = 30;
  const barWidth = 30;
  const gap = 20;
  const maxAvailability = Math.max(...data.map(libro => libro.Disponibilidad_Libro), 1);
  const colorPalette = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#A855F7'];

  return (
    <div className="flex flex-col items-center overflow-x-auto p-4">
      <svg width={data.length * (barWidth + gap) + padding * 2} height={chartHeight + padding * 2} viewBox={`0 0 ${data.length * (barWidth + gap) + padding * 2} ${chartHeight + padding * 2}`}>
        <line x1={padding} y1={padding} x2={padding} y2={chartHeight + padding} stroke="#E5E7EB" strokeWidth="1" />
        <line x1={padding} y1={chartHeight + padding} x2={data.length * (barWidth + gap) + padding} y2={chartHeight + padding} stroke="#E5E7EB" strokeWidth="1" />

        {data.map((libro, index) => {
          const x = padding + index * (barWidth + gap) + gap / 2;
          const barHeight = (libro.Disponibilidad_Libro / maxAvailability) * chartHeight;
          const y = chartHeight + padding - barHeight;
          const color = colorPalette[index % colorPalette.length]; // Asignar un color diferente

          return (
            <g key={libro.Id_Libro}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx="3" className="hover:opacity-80" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#374151" className="font-semibold">
                {libro.Disponibilidad_Libro}
              </text>
              <text x={x + barWidth / 2} y={chartHeight + padding + 15} textAnchor="middle" fontSize="10" fill="#6B7280">
                {libro.Nombre_Libro.substring(0, 7)}...
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


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
  // --- Estados para los datos de la API (Sin cambios) ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vencidos, setVencidos] = useState<PrestamoVencido[]>([]);
  const [masPrestados, setMasPrestados] = useState<LibroMasPrestado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect (Sin cambios) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsRes, vencidosRes, masPrestadosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/consultas/dashboard-stats`),
          fetch(`${API_BASE_URL}/consultas/vencidos-detalle`),
          fetch(`${API_BASE_URL}/consultas/mas-prestados`),
        ]);

        if (!statsRes.ok || !vencidosRes.ok || !masPrestadosRes.ok) {
          throw new Error('No se pudieron cargar todos los datos del dashboard');
        }

        const statsData = await statsRes.json();
        const vencidosData = await vencidosRes.json();
        const masPrestadosData = await masPrestadosRes.json();

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
  }, []);

  // --- Renderizado Condicional (Carga y Error) ---
  // (Estilos de fondo actualizados)
  if (isLoading) {
    return <div className="p-6 text-center bg-gray-100 min-h-screen text-gray-700">Cargando panel de administración...</div>;
  }

  if (error) {
    return <div className="p-6 text-center bg-gray-100 min-h-screen text-red-600">
      Error al cargar el dashboard: {error}
    </div>;
  }

  if (!stats) {
    return <div className="p-6 text-center bg-gray-100 min-h-screen text-gray-600">No se pudieron cargar las estadísticas.</div>;
  }

  // --- Definición de las Tarjetas de Estadísticas (CON COLORES) ---
  const statCards = [
    {
      title: 'Total Libros',
      value: stats.totalLibros,
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Usuarios',
      value: stats.totalUsuarios,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Préstamos Activos',
      value: stats.prestamosActivos,
      icon: FileText,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Préstamos Vencidos',
      value: stats.prestamosVencidos,
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Disponibles',
      value: stats.librosDisponibles,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Autores',
      value: stats.totalAutores,
      icon: UserCheck,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
  ];

  // --- Renderizado Principal (CON NUEVO DISEÑO) ---
  return (
    // Fondo claro
    <div className="bg-gray-100 min-h-screen space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        {/* Título Moderno */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Hola, bienvenido de nuevo! 👋</h2>
        <p className="text-gray-600">Resumen del sistema bibliotecario</p>
      </div>

     

      {/* --- Columnas de Listas y Gráficas --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Columna 1: Préstamos Vencidos (Estilo de Alerta) */}
        <Card>
          <CardHeader>
            <CardTitle>Préstamos Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            {vencidos.length > 0 ? (
              <div className="space-y-3">
                {vencidos.map((item) => (
                  // Estilo rojo y vibrante
                  <div key={item.Id_Prestamo} className="p-3 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.Nombre_Libro}</p>
                      <p className="text-sm text-gray-600">Usuario: {item.Prim_Nom_Usuario} {item.Prim_Apelli_Usuario}</p>
                      <p className="text-xs text-red-500 font-medium">Venció el: {new Date(item.Fecha_Entrega_Prestamo).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-red-400 text-white rounded-full text-xs font-bold">
                      Vencido
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Estilo de éxito (verde)
              <p className="text-green-600 text-center py-8">¡Excelente! No hay préstamos vencidos.</p>
            )}
          </CardContent>
        </Card>

        {/* Columna 2: GRÁFICAS (en lugar de la lista) */}
        <div className="space-y-6">
          {/* Gráfico Circular: Libros más Prestados */}
          <Card>
            <CardHeader>
              <CardTitle>Popularidad de Libros (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Usamos slice() para no saturar la gráfica */}
              <PieChart data={masPrestados.slice(0, 5)} title="libros más prestados" />
            </CardContent>
          </Card>

          {/* Gráfico de Barras: Disponibilidad */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart data={masPrestados.slice(0, 5)} title="disponibilidad" />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}