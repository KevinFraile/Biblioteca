import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, User, UserCog } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('usuario');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sistema de Gestión de Biblioteca</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="usuario" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuario
              </TabsTrigger>
              <TabsTrigger value="bibliotecario" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Bibliotecario
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>

              {selectedRole === 'usuario' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={onRegister}
                >
                  Registrarse
                </Button>
              )}
            </form>

            <TabsContent value="usuario" className="mt-4">
              <p className="text-sm text-muted-foreground text-center">
                Demo: juan.perez@email.com / password
              </p>
            </TabsContent>
            <TabsContent value="bibliotecario" className="mt-4">
              <p className="text-sm text-muted-foreground text-center">
                Demo: ana.admin@biblioteca.com / password
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
