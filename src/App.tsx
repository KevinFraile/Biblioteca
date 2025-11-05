import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { UsuarioInicio } from './components/views/UsuarioInicio';
import { BibliotecarioInicio } from './components/views/BibliotecarioInicio';
import { LibrosView } from './components/views/LibrosView';
import { PrestamosView } from './components/views/PrestamosView';
import { CRUDView } from './components/views/CRUDView';
import { ConsultasView } from './components/views/ConsultasView';
import { PerfilView } from './components/views/PerfilView';
import { UserRole, User } from './types';
import { usuarios, autores, editoriales, categorias, generos } from './data/mockData';
import { Toaster, toast } from 'sonner@2.0.3';

type AppView = 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardView, setDashboardView] = useState('inicio');

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app, this would validate against backend
    const user = usuarios.find(u => u.email === email && u.role === role);
    
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
      setDashboardView('inicio');
      toast.success(`Bienvenido, ${user.nombre}`);
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  const handleRegister = () => {
    toast.success('Registro exitoso. Iniciando sesión...');
    // Mock registration
    const newUser: User = {
      id: '999',
      nombre: 'Nuevo Usuario',
      email: 'nuevo@email.com',
      telefono: '+34 600 000 000',
      direccion: 'Nueva Dirección',
      tipo_documento: 'DNI',
      numero_documento: '00000000X',
      role: 'usuario',
    };
    setCurrentUser(newUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setDashboardView('inicio');
    toast.info('Sesión cerrada');
  };

  const handleNavigate = (view: string) => {
    setDashboardView(view);
  };

  const handleRequestLoan = (libroId: string) => {
    toast.success('Solicitud de préstamo enviada. Esperando aprobación.');
  };

  const handleSaveProfile = (userData: User) => {
    setCurrentUser(userData);
    toast.success('Perfil actualizado correctamente');
  };

  const renderDashboardContent = () => {
    if (!currentUser) return null;

    switch (dashboardView) {
      case 'inicio':
        return currentUser.role === 'usuario' 
          ? <UsuarioInicio userId={currentUser.id} />
          : <BibliotecarioInicio />;
      
      case 'libros':
        return <LibrosView role={currentUser.role} onRequestLoan={handleRequestLoan} />;
      
      case 'prestamos':
        return <PrestamosView role={currentUser.role} userId={currentUser.id} />;
      
      case 'autores':
        return currentUser.role === 'bibliotecario' ? (
          <CRUDView
            title="Autores"
            description="Gestión de autores de libros"
            data={autores}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'nacionalidad', label: 'Nacionalidad' },
              { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento' },
            ]}
            formFields={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'nacionalidad', label: 'Nacionalidad' },
              { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date' },
            ]}
            onAdd={(data) => toast.success('Autor agregado')}
            onEdit={(id, data) => toast.success('Autor actualizado')}
            onDelete={(id) => toast.success('Autor eliminado')}
          />
        ) : null;
      
      case 'editoriales':
        return currentUser.role === 'bibliotecario' ? (
          <CRUDView
            title="Editoriales"
            description="Gestión de editoriales"
            data={editoriales}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'pais', label: 'País' },
            ]}
            formFields={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'pais', label: 'País' },
            ]}
            onAdd={(data) => toast.success('Editorial agregada')}
            onEdit={(id, data) => toast.success('Editorial actualizada')}
            onDelete={(id) => toast.success('Editorial eliminada')}
          />
        ) : null;
      
      case 'categorias':
        return currentUser.role === 'bibliotecario' ? (
          <CRUDView
            title="Categorías"
            description="Gestión de categorías de libros"
            data={categorias}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'descripcion', label: 'Descripción' },
            ]}
            formFields={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'descripcion', label: 'Descripción' },
            ]}
            onAdd={(data) => toast.success('Categoría agregada')}
            onEdit={(id, data) => toast.success('Categoría actualizada')}
            onDelete={(id) => toast.success('Categoría eliminada')}
          />
        ) : null;
      
      case 'generos':
        return currentUser.role === 'bibliotecario' ? (
          <CRUDView
            title="Géneros"
            description="Gestión de géneros literarios"
            data={generos}
            columns={[
              { key: 'nombre', label: 'Nombre' },
            ]}
            formFields={[
              { key: 'nombre', label: 'Nombre' },
            ]}
            onAdd={(data) => toast.success('Género agregado')}
            onEdit={(id, data) => toast.success('Género actualizado')}
            onDelete={(id) => toast.success('Género eliminado')}
          />
        ) : null;
      
      case 'usuarios':
        return currentUser.role === 'bibliotecario' ? (
          <CRUDView
            title="Usuarios"
            description="Gestión de usuarios del sistema"
            data={usuarios.filter(u => u.role === 'usuario')}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'telefono', label: 'Teléfono' },
              { key: 'numero_documento', label: 'Documento' },
            ]}
            formFields={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'telefono', label: 'Teléfono', type: 'tel' },
              { key: 'direccion', label: 'Dirección' },
              { key: 'tipo_documento', label: 'Tipo de Documento' },
              { key: 'numero_documento', label: 'Número de Documento' },
            ]}
            onAdd={(data) => toast.success('Usuario agregado')}
            onEdit={(id, data) => toast.success('Usuario actualizado')}
            onDelete={(id) => toast.success('Usuario eliminado')}
          />
        ) : null;
      
      case 'consultas':
        return currentUser.role === 'bibliotecario' ? <ConsultasView /> : null;
      
      case 'perfil':
        return <PerfilView user={currentUser} onSave={handleSaveProfile} />;
      
      default:
        return null;
    }
  };

  if (currentView === 'login') {
    return (
      <>
        <LoginScreen 
          onLogin={handleLogin} 
          onRegister={() => setCurrentView('register')}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  if (currentView === 'register') {
    return (
      <>
        <RegisterScreen 
          onBack={() => setCurrentView('login')}
          onRegister={handleRegister}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <>
        <DashboardLayout
          role={currentUser.role}
          currentView={dashboardView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={currentUser.nombre}
        >
          {renderDashboardContent()}
        </DashboardLayout>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return null;
}
