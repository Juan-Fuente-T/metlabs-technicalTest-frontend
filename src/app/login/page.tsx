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
    } catch (error: any) {
      console.error('Error en la petición de login:', error);
      toast.error(error.message || 'Error en la iniciar sesión');
      // setMessage(error.message || 'Error de conexión o del servidor al intentar iniciar sesión.');
    }
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="register-email">Email:</label>
          <input
            className='border border-solid border-black'
            type="email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="register-password">Contraseña:</label>
          <input
            className='border border-solid border-black'
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className='border border-solid border-black cursor-pointer'
          type="submit"
        >
          Registrarse
        </button>
      </form>
      {/* {message && <p>{message}</p>} */}

      <h1 style={{marginTop: '20px'}}>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="login-email">Email:</label>
          <input className='border border-solid border-black' type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="login-password">Contraseña:</label>
          <input className='border border-solid border-black' type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button 
        className='border border-solid border-black cursor-pointer'
        type="submit"
        >
          Iniciar Sesión
          </button>
      </form>
    </div>
  );
}
