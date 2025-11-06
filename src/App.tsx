import { useState, useEffect, useCallback } from 'react';
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
// Dejamos 'usuarios' para el mock login, pero quitamos los otros datos mock
import { usuarios } from './data/mockData'; 
import { Toaster, toast } from 'sonner';


type AppView = 'login' | 'register' | 'dashboard';

// Definimos la URL de la API
const API_URL = 'http://localhost:3001';

// --- Hook Genérico para operaciones CRUD ---
// Este hook manejará el estado y las llamadas a la API para cada entidad
const useCrud = (endpoint: string) => {
  const [data, setData] = useState<any[]>([]);

  // 1. OBTENER (READ ALL)
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) throw new Error(`Error al cargar ${endpoint}`);
      const apiData = await response.json();
      setData(apiData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 2. CREAR (CREATE)
  const addItem = async (item: any) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error al crear en ${endpoint}`);
      }
      toast.success(`${endpoint} agregado exitosamente`);
      fetchData(); // Recargar datos
    } catch (error: any) {
      toast.error(`Error al crear: ${error.message}`);
    }
  };

  // 3. ACTUALIZAR (UPDATE)
  const updateItem = async (id: string, item: any) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error al actualizar en ${endpoint}`);
      }
      toast.success(`${endpoint} actualizado exitosamente`);
      fetchData(); // Recargar datos
    } catch (error: any) {
      toast.error(`Error al actualizar: ${error.message}`);
    }
  };

  // 4. ELIMINAR (DELETE)
  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error al eliminar en ${endpoint}`);
      }
      toast.success(`${endpoint} eliminado exitosamente`);
      fetchData(); // Recargar datos
    } catch (error: any) {
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, [endpoint]); // Se ejecuta cuando el 'endpoint' cambia

  return { data, addItem, updateItem, deleteItem };
};
// --- Fin del Hook CRUD ---


export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardView, setDashboardView] = useState('inicio');

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app, this would validate against backend
    const user = usuarios.find((u:any) => u.email === email && u.role === role);
    
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

  // --- Componente de renderizado ---
  // Usamos un componente interno para poder usar el hook
  const CrudAutores = () => {
    const { data: autoresData, addItem, updateItem, deleteItem } = useCrud('autores');
    return (
      <CRUDView
        title="Autores"
        description="Gestión de autores de libros"
        data={autoresData}
        idKey="Id_Autor" // Clave primaria de la tabla
        columns={[
          { key: 'Nombre_Autor', label: 'Nombre' },
          { key: 'Apellido_Autor', label: 'Apellido' },
        ]}
        formFields={[
          { key: 'Nombre_Autor', label: 'Nombre' },
          { key: 'Apellido_Autor', label: 'Apellido' },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
      />
    );
  };

  const CrudEditoriales = () => {
    const { data: editorialesData, addItem, updateItem, deleteItem } = useCrud('editoriales');
    return (
      <CRUDView
        title="Editoriales"
        description="Gestión de editoriales"
        data={editorialesData}
        idKey="Id_Editorial"
        columns={[
          { key: 'Nombre_Editorial', label: 'Nombre' },
        ]}
        formFields={[
          { key: 'Nombre_Editorial', label: 'Nombre' },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
      />
    );
  };

  const CrudCategorias = () => {
    const { data: categoriasData, addItem, updateItem, deleteItem } = useCrud('categorias');
    return (
      <CRUDView
        title="Categorías"
        description="Gestión de categorías de libros"
        data={categoriasData}
        idKey="Id_Categoria"
        columns={[
          { key: 'Nombre_Categoria', label: 'Nombre' },
        ]}
        formFields={[
          { key: 'Nombre_Categoria', label: 'Nombre' },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
      />
    );
  };

  const CrudGeneros = () => {
    const { data: generosData, addItem, updateItem, deleteItem } = useCrud('generos');
    return (
      <CRUDView
        title="Géneros"
        description="Gestión de géneros literarios"
        data={generosData}
        idKey="Id_Genero"
        columns={[
          { key: 'Nombre_Genero', label: 'Nombre' },
        ]}
        formFields={[
          { key: 'Nombre_Genero', label: 'Nombre' },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
      />
    );
  };

  const CrudUsuarios = () => {
    const { data: usuariosData, addItem, updateItem, deleteItem } = useCrud('usuarios');
    return (
      <CRUDView
        title="Usuarios"
        description="Gestión de usuarios del sistema"
        data={usuariosData} // La API ya filtra (si es necesario), o puedes filtrar aquí
        idKey="Id_Usuario"
        columns={[
          { key: 'Prim_Nom_Usuario', label: 'Nombre' },
          { key: 'Prim_Apelli_Usuario', label: 'Apellido' },
          { key: 'Correo_Usuario', label: 'Email' },
          { key: 'Tel_Usuario', label: 'Teléfono' },
          { key: 'Doc_Usuario', label: 'Documento' },
        ]}
        formFields={[
          { key: 'Prim_Nom_Usuario', label: 'Primer Nombre' },
          { key: 'Seg_Nom_Usuario', label: 'Segundo Nombre' },
          { key: 'Prim_Apelli_Usuario', label: 'Primer Apellido' },
          { key: 'Seg_Apelli_Usuario', label: 'Segundo Apellido' },
          { key: 'Id_Tipo_Doc_Usuario', label: 'ID Tipo Documento' },
          { key: 'Doc_Usuario', label: 'Documento' },
          { key: 'Direc_Usuario', label: 'Dirección' },
          { key: 'Tel_Usuario', label: 'Teléfono', type: 'tel' },
          { key: 'Correo_Usuario', label: 'Email', type: 'email' },
          { key: 'Fecha_Nac_Usuario', label: 'Fecha Nacimiento', type: 'date' },
          { key: 'Fecha_Reg_Usuario', label: 'Fecha Registro', type: 'date' },
        ]}
        onAdd={addItem}
        onEdit={updateItem}
        onDelete={deleteItem}
      />
    );
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
        return currentUser.role === 'bibliotecario' ? <CrudAutores /> : null;
      
      case 'editoriales':
        return currentUser.role === 'bibliotecario' ? <CrudEditoriales /> : null;
      
      case 'categorias':
        return currentUser.role === 'bibliotecario' ? <CrudCategorias /> : null;
      
      case 'generos':
        return currentUser.role === 'bibliotecario' ? <CrudGeneros /> : null;
      
      case 'usuarios':
        return currentUser.role === 'bibliotecario' ? <CrudUsuarios /> : null;
      
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