
// Asegúrarse que sea un Client Component si se usa estado y event handlers
"use client"; // <--- MUY IMPORTANTE para usar hooks como useState y manejar eventos

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { API_BASE_URL } from "@/utils/constants";
import { apiService } from "@/services/apiService";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import AuthForm from '@/components/auth/AuthForm';
import GoogleSignInButton from '@/components/auth/CustomGoogleLoginButton';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

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
      console.log("Respuesta de login:", responseData);
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

  return (
    <div className=" flex flex-col justify-center items-center  sm:py-10 sm:px-4 sm:px-6 lg:px-8">
      {/* <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-8"> */}
      <div className="flex flex-col justify-center items-center md:flex-row w-full max-w-4xl lg:max-w-5xl bg-white overflow-hidden">

        {/* Columna Izquierda: Imagen */}
        <div className="w-5/6 md:block md:w-1/2 lg:w-5/12 flex-shrink-0"> {/* Ancho ajustado */}
          <Image
            src="/ImagenPortada.png" 
            alt="Edificio Metlabs"
            width={480} 
            height={532} 
            // className="object-cover w-full h-full" // h-full para que ocupe la altura del contenedor padre
            className="object-cover" 
          />
        </div>

        {/* Columna Derecha: Contenido de Autenticación */}
        <div className="w-full md:w-1/2 lg:w-7/12 p-4 sm:p-12 flex flex-col justify-center space-y-6"> {/* Padding y centrado */}
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLoginSubmit={handleLogin}
            onRegisterSubmit={handleRegister}
            acceptTerms={acceptTerms} // <--- PASA EL ESTADO DEL CHECKBOX
            setAcceptTerms={setAcceptTerms} // <--- PASA LA FUNCIÓN PARA ACTUALIZARLO
          />

          {/* Separador "or" */}
          <div className="relative"> {/* Eliminado my-6 para que lo controle el space-y-6 del padre */}
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#1D1E41]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="text-[#1D1E41]">or</span>
            </div>
          </div>

          <GoogleSignInButton />


          {/* Enlace para registrarse (TEMPORALMENTE - antes era un botón secundario) */}
          <p className="mt-4 text-center text-sm text-[#1D1E41]">
            Si todavía no tienes cuenta,{' '}
            <button
              onClick={handleRegister} //SOLO TEMPORALMENTE - CUIDADO
              className="font-medium text-[#EE731B] hover:underline focus:outline-none"
            >
              regístrate ahora
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}


