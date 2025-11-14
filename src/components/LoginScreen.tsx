import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, UserCog } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, 'bibliotecario');
  };

  const backgroundStyles = {
    backgroundImage: "url('https://estepais.com/wp-content/uploads/2024/04/Proyecto-nuevo-15.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyles}
    >
      <Card className="w-full max-w-md">
        <br />
        <CardContent>
          {/* La clase 'text-indigo-600' se quitó del div padre
            y se aplicó 'text-orange-600' directamente al span.
            El ícono (UserCog) heredará el color de texto por defecto.
          */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <UserCog className="h-5 w-5" />
            <span className="font-semibold text-orange-600">
              Inicio de Sesión - Bibliotecario
            </span>
          </div>
          
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
          </form>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground text-center">
              Demo: kevinfc801@gmail.com / password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}