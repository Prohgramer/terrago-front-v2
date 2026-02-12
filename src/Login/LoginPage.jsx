import React, { useState } from 'react';
//import { Eye, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/AuthProvider';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
//import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, Eye } from "lucide-react"
//import { useState } from "react"

export const LoginPage=() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Add this to prevent form default submission
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validación básica del frontend
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }

      // Llamada a tu API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso
        setSuccess('Inicio de sesión exitoso');

        // Guardar token y datos del usuario
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        // Actualizar estado global de autenticación y redirigir a "/"
        if (auth && typeof auth.login === 'function') {
          auth.login(data.user);
        }

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 600);

      } else {
        // Error en el login
        setError(data.error || 'Error en el inicio de sesión');
      }

    } catch (err) {
      console.error('Error en la petición:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
        <CardContent className="p-8 space-y-6">
          {/* Logo y título */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   className="h-7 w-7 text-white" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 9.75L12 4l9 5.75M4.5 10.5V19.5a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5V10.5M9 21V12h6v9"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">TERREGO</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Accede a tu cuenta</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  className="pl-10 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                />
                <Eye 
                  className="absolute right-3 top-3 h-5 w-5 text-neutral-400 dark:text-neutral-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Botón */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-amber-500 hover:opacity-90 transition text-white">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">o continúa con</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div> */}

          {/* Social login */}
          {/* <div className="flex gap-3">
            <Button variant="outline" className="flex-1 dark:border-neutral-700 dark:text-neutral-200">
              <img src="https://www.svgrepo.com/show/355037/google.svg" 
                   alt="Google" className="h-5 w-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="flex-1 dark:border-neutral-700 dark:text-neutral-200">
              <img src="https://www.svgrepo.com/show/157810/facebook.svg" 
                   alt="Facebook" className="h-5 w-5 mr-2" />
              Facebook
            </Button>
          </div> */}

          {/* Registro */}
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Regístrate aquí
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}