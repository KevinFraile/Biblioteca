import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  Search, 
  User, 
  LogOut,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types';

interface DashboardLayoutProps {
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = role === 'usuario' 
    ? [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'libros', label: 'Libros', icon: BookOpen },
        { id: 'prestamos', label: 'Mis Préstamos', icon: FileText },
        { id: 'perfil', label: 'Perfil', icon: User },
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
        { id: 'consultas', label: 'Consultas', icon: BarChart3 },
        { id: 'perfil', label: 'Perfil', icon: User },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Sistema de Biblioteca</h1>
                <p className="text-sm text-gray-500">
                  {role === 'usuario' ? 'Usuario' : 'Bibliotecario'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm">{userName}</p>
              <p className="text-xs text-gray-500">{role === 'usuario' ? 'Lector' : 'Administrador'}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:sticky lg:translate-x-0 top-[57px] left-0 h-[calc(100vh-57px)]
            w-64 bg-white border-r border-gray-200 transition-transform duration-200 z-20
          `}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isActive ? 'bg-indigo-50 text-indigo-700' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
