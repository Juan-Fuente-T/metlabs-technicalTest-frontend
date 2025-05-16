// // app/login/page.tsx o src/app/login/page.tsx
// export default function LoginPage() {
//   return (
//     <div>
//       <h1>Página de Login y Registro</h1>
//       <p>Aquí irán los formularios de email/contraseña y el botón de Google.</p>
//       {/* Más adelante aquí irán los formularios y la lógica */}
//     </div>
//   );
// }

// Asegúrarse que sea un Client Component si se usa estado y event handlers
"use client"; // <--- MUY IMPORTANTE para usar hooks como useState y manejar eventos

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { API_BASE_URL } from "@/utils/constants";
import { apiService } from "@/services/apiService";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState('');

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    // setMessage('');

    try {
      const responseData = await apiService.auth.register({ email, password });
      toast.success('Registro exitoso');
      // setMessage(`Usuario registrado con éxito: ${responseData.user?.email || ''} (ID: ${responseData.user?.id || ''})`);
      
      if (responseData.token) {
        // localStorage.setItem('authToken', responseData.token);
        login(responseData.token, responseData.user);
      }
      
      setTimeout(() => {
        router.push('/profile');
      }, 1500); // Redirigir despues de 3 segundos
      setEmail('');
      setPassword('');

    } catch (error: any) {
      console.error('Error en la petición de registro:', error);
      // setMessage(error.message || 'Error de conexión o del servidor al intentar registrar.');
      toast.error(error.message || 'Error en la petición de registro');
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Iniciando sesión con email:", email, "y password:", password);
    try {
      const responseData = await apiService.auth.login({ email, password });
      console.log("Respuesta de login:",responseData);
      toast.success('Login exitoso');
      // setMessage(`Usuario logueado con éxito: ${responseData.user?.email || ''} (ID: ${responseData.user?.id || ''})`);
      
      if (responseData.token && responseData) {
        // localStorage.setItem('authToken', responseData.token);
        login(responseData.token, responseData.user);
      }

      setTimeout(() => {
        router.push('/profile');
      }, 1500); // Redirigir despues de 1.5 segundos

      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Error en la petición de login:', error);
      toast.error(error.message || 'Error en la iniciar sesión');
      // setMessage(error.message || 'Error de conexión o del servidor al intentar iniciar sesión.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    const idToken = credentialResponse.credential; // Este es el ID Token JWT de Google

    if (idToken) {
      try {
        // Se envía este idToken al backend para verificación y para que el backend emita SU PROPIO JWT
        const backendResponse = await apiService.auth.loginWithGoogle(idToken); 
        
        toast.success(backendResponse.message || 'Login con Google exitoso!');
        if (backendResponse.token && backendResponse.user) {
          login(backendResponse.token, backendResponse.user); // Usa la función login del AuthContext
        }
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } catch (error: any) {
        console.error("Error al procesar login con Google en el backend:", error);
        toast.error(error.message || 'Error en login con Google.');
      }
    } else {
      toast.error('No se recibió el token de credencial de Google.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
    toast.error('El inicio de sesión con Google falló.');
  };


 return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-8">
        
        {/* Sección de Registro */}
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-6">
            Crear una Cuenta
          </h1>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
                Email:
              </label>
              <input
                id="register-email"
                name="email" 
                type="email"
                autoComplete="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
                Contraseña:
              </label>
              <input
                id="register-password"
                name="password" 
                type="password"
                autoComplete="new-password"
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Sección de Login */}
        <div className="pt-8 border-t border-slate-200"> {/* Separador visual */}
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-6">
            Iniciar Sesión
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email:</label>
              <input 
                id="login-email"
                name="email"
                type="email" 
                autoComplete="email"
                required
                value={email} // Asumiendo que usas el mismo estado 'email'
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">Contraseña:</label>
              <input 
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password} // Asumiendo que usas el mismo estado 'password'
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>
            <button 
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
        
        {/* Sección de Login con Google */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            O inicia sesión con:
          </h2>
          <div className="flex justify-center"> {/* Contenedor para centrar el botón de Google */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              // Aquí puedes añadir props para personalizar el botón de Google si quieres
              theme="outline"
              size="large"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
