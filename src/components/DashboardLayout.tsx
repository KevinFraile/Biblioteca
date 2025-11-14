import { ReactNode, useState } from 'react'; // <-- Importar useState
import { Button } from './ui/button';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  User, 
  LogOut,
} from 'lucide-react';
import { UserRole } from '../types';

import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface DashboardLayoutProps {
  // ... (props sin cambios)
  children: ReactNode;
  role: UserRole;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName: string;
}

export function DashboardLayout({ 
  children, 
  role, 
  currentView, 
  onNavigate, 
  onLogout,
  userName 
}: DashboardLayoutProps) {

  // --- NUEVO ESTADO PARA CONTROLAR EL HOVER ---
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ... (definición de menuItems y userMenuItems sin cambios)
  const menuItems = role === 'usuario' 
    ? [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'libros', label: 'Libros', icon: BookOpen },
        { id: 'prestamos', label: 'Mis Préstamos', icon: FileText },
      ]
    : [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'libros', label: 'Libros', icon: BookOpen },
        { id: 'autores', label: 'Autores', icon: Users },
        { id: 'editoriales', label: 'Editoriales', icon: BookOpen },
        { id: 'categorias', label: 'Categorías', icon: FileText },
        { id: 'generos', label: 'Géneros', icon: FileText },
        { id: 'usuarios', label: 'Usuarios', icon: Users },
        { id: 'prestamos', label: 'Préstamos', icon: FileText },
      ];

  const userMenuItems = [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ];
  
  // Códigos de color
  const colorActivo = '#EA580C'; // Naranja 600
  const colorHover = '#FFEDD5'; // Naranja 100 (para el fondo)
  const textoHover = '#C2410C'; // Naranja 700 (para el texto)
  const textoInactivo = '#4B5563'; // Gray 600

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-gray-50">
        
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
            
            <div className="flex items-center gap-3">
              {/* Usamos el style aquí también por si acaso */}
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colorActivo }}
              >
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-bold text-lg hidden sm:block">Sistema de Biblioteca</h1>
            </div>

            <nav className="flex-1">
              <div className="flex items-center justify-center gap-1 overflow-x-auto py-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  const isHovered = hoveredId === item.id;

                  // --- LÓGICA DE ESTILOS EN LÍNEA ---
                  const getStyle = () => {
                    if (isActive) {
                      return { backgroundColor: colorActivo, color: 'white' };
                    }
                    if (isHovered) {
                      return { backgroundColor: colorHover, color: textoHover };
                    }
                    return { backgroundColor: 'transparent', color: textoInactivo };
                  };

                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'ghost'}
                          size="icon"
                          className="rounded-lg" // Quitamos todas las clases de color
                          // --- APLICAMOS ESTILOS Y EVENTOS ---
                          style={getStyle()}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => onNavigate(item.id)}
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </nav>

            {/* ... (Dropdown menu no cambia) ... */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {role === 'usuario' ? 'Lector' : 'Administrador'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {role === 'usuario' && userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.id} onClick={() => onNavigate(item.id)}>
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                  {role === 'usuario' && <DropdownMenuSeparator />}

                  <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}