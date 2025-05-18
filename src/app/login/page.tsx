
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

  const handleRegister = async () => {
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
      }, 1500); // Redirigir despues de 1.5 segundos
      setEmail('');
      setPassword('');

    } catch (error: unknown) {
       console.error("Error:", error); 
       let errorMessage = "Error en el registro."; 
       if (error instanceof Error) { 
        errorMessage = error.message; 
      } 
      toast.error(errorMessage); 
    }
  };

  const handleLogin = async () => {
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
    } catch (error: unknown) { 
      console.error("Error:", error); 
      let errorMessage = "Error en el inicio de sesión."; 
      if (error instanceof Error) { 
        errorMessage = error.message; 
      } 
      toast.error(errorMessage); 
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
      } catch (error: unknown) { 
        console.error("Error:", error); 
        let errorMessage = "Error en el inicio de sesión con Google."; 
        if (error instanceof Error) {
           errorMessage = error.message; 
          } 
          toast.error(errorMessage); 
      }
    } else {
      toast.error('No se recibió el token de credencial de Google.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
    toast.error('El inicio de sesión con Google falló.');
  };


  // Clases para los botones
  const primaryButtonClass = "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 transition-colors";
  const secondaryButtonClass = "w-full flex justify-center py-2.5 px-4 border border-slate-800 rounded-lg shadow-sm text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 transition-colors";

 return (
    <div className=" flex flex-col justify-center items-center bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-6">
            Accede o Crea tu Cuenta
          </h1>
          {/* El <form> aquí es más para estructura semántica. El envío se maneja por los onClick de los botones. */}
          {/* Podría ponerse un onSubmit={e => e.preventDefault()} para asegurar que Enter en un campo no haga nada inesperado. */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700">
                Email:
              </label>
              <input
                id="auth-email"
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
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700">
                Contraseña:
              </label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete="current-password" // O "new-password" si el foco está en registrar
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            {/* Contenedor para los botones de acción */}
            <div className="space-y-4">
              <button
                type="button" // Importante: type="button" para que no haga submit del form por sí mismo
                onClick={handleLogin} 
                className={primaryButtonClass}
              >
                Iniciar Sesión
              </button>
              <button
                type="button" // Importante: type="button"
                onClick={handleRegister} 
                className={secondaryButtonClass} // Un estilo diferente para el secundario
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center">
          <h2 className="text-lg font-semibold text-slate-700 mb-4"> 
            O continúa con:
          </h2>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
