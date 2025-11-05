import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Database, TrendingUp, Users, BookOpen } from 'lucide-react';
import { libros, usuarios, prestamos, autores, editoriales } from '../../data/mockData';

export function ConsultasView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [queryType, setQueryType] = useState<string>('');

  const predefinedQueries = [
    {
      id: 'libros-disponibles',
      name: 'Libros Disponibles',
      icon: BookOpen,
      description: 'Muestra todos los libros con disponibilidad',
    },
    {
      id: 'libros-prestados',
      name: 'Libros Más Prestados',
      icon: TrendingUp,
      description: 'Ranking de libros más solicitados',
    },
    {
      id: 'usuarios-activos',
      name: 'Usuarios Activos',
      icon: Users,
      description: 'Usuarios con préstamos activos',
    },
    {
      id: 'prestamos-vencidos',
      name: 'Préstamos Vencidos',
      icon: Database,
      description: 'Préstamos que superaron la fecha de devolución',
    },
  ];

  const executeQuery = (queryId: string) => {
    setQueryType(queryId);
    
    switch (queryId) {
      case 'libros-disponibles':
        const disponibles = libros.filter(l => l.cantidad_disponible > 0).map(libro => ({
          titulo: libro.titulo,
          autor: autores.find(a => a.id === libro.autor_id)?.nombre,
          disponibles: libro.cantidad_disponible,
          total: libro.cantidad_total,
          editorial: editoriales.find(e => e.id === libro.editorial_id)?.nombre,
        }));
        setResults(disponibles);
        setQuery(`SELECT titulo, autor, cantidad_disponible, cantidad_total, editorial
FROM libros
WHERE cantidad_disponible > 0`);
        break;

      case 'libros-prestados':
        const prestamosCount: { [key: string]: number } = {};
        prestamos.forEach(p => {
          prestamosCount[p.libro_id] = (prestamosCount[p.libro_id] || 0) + 1;
        });
        const ranking = Object.entries(prestamosCount)
          .map(([libroId, count]) => {
            const libro = libros.find(l => l.id === libroId);
            return {
              titulo: libro?.titulo,
              autor: autores.find(a => a.id === libro?.autor_id)?.nombre,
              prestamos: count,
            };
          })
          .sort((a, b) => b.prestamos - a.prestamos);
        setResults(ranking);
        setQuery(`SELECT l.titulo, a.nombre as autor, COUNT(p.id) as prestamos
FROM prestamos p
JOIN libros l ON p.libro_id = l.id
JOIN autores a ON l.autor_id = a.id
GROUP BY l.id
ORDER BY prestamos DESC`);
        break;

      case 'usuarios-activos':
        const activos = prestamos
          .filter(p => p.estado === 'activo')
          .map(p => {
            const usuario = usuarios.find(u => u.id === p.usuario_id);
            const libro = libros.find(l => l.id === p.libro_id);
            return {
              usuario: usuario?.nombre,
              email: usuario?.email,
              libro: libro?.titulo,
              fecha_devolucion: p.fecha_devolucion_esperada,
            };
          });
        setResults(activos);
        setQuery(`SELECT u.nombre, u.email, l.titulo as libro, p.fecha_devolucion_esperada
FROM prestamos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN libros l ON p.libro_id = l.id
WHERE p.estado = 'activo'`);
        break;

      case 'prestamos-vencidos':
        const today = new Date().toISOString().split('T')[0];
        const vencidos = prestamos
          .filter(p => p.estado === 'activo' && p.fecha_devolucion_esperada < today)
          .map(p => {
            const usuario = usuarios.find(u => u.id === p.usuario_id);
            const libro = libros.find(l => l.id === p.libro_id);
            return {
              usuario: usuario?.nombre,
              libro: libro?.titulo,
              fecha_prestamo: p.fecha_prestamo,
              fecha_devolucion_esperada: p.fecha_devolucion_esperada,
              dias_vencido: Math.floor((new Date().getTime() - new Date(p.fecha_devolucion_esperada).getTime()) / (1000 * 60 * 60 * 24)),
            };
          });
        setResults(vencidos);
        setQuery(`SELECT u.nombre as usuario, l.titulo as libro, p.fecha_prestamo, 
       p.fecha_devolucion_esperada, 
       DATEDIFF(CURRENT_DATE, p.fecha_devolucion_esperada) as dias_vencido
FROM prestamos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN libros l ON p.libro_id = l.id
WHERE p.estado = 'activo' AND p.fecha_devolucion_esperada < CURRENT_DATE`);
        break;

      default:
        setResults(null);
    }
  };

  const renderResults = () => {
    if (!results || results.length === 0) {
      return <p className="text-gray-500 text-center py-8">No se encontraron resultados</p>;
    }

    const columns = Object.keys(results[0]);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col}>
                {col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row: any, idx: number) => (
            <TableRow key={idx}>
              {columns.map(col => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Consultas Avanzadas</h2>
        <p className="text-gray-600">Ejecute consultas predefinidas o escriba sus propias consultas SQL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predefinedQueries.map(pq => {
          const Icon = pq.icon;
          return (
            <Card
              key={pq.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => executeQuery(pq.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">{pq.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{pq.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consulta SQL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Escriba su consulta SQL aquí... (Solo consultas SELECT)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => executeQuery(queryType)}>
              <Search className="h-4 w-4 mr-2" />
              Ejecutar Consulta
            </Button>
            <Button variant="outline" onClick={() => { setQuery(''); setResults(null); setQueryType(''); }}>
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultados</CardTitle>
              <Badge>{results.length} registro(s)</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {renderResults()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
