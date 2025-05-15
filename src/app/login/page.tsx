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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    setMessage('');


    try {
      const responseData = await apiService.auth.register({ email, password });
      toast.success('Registro exitoso');
      setMessage(`Usuario registrado con éxito: ${responseData.user?.email || ''} (ID: ${responseData.user?.id || ''})`);
      setTimeout(() => {
        router.push('/profile');
      }, 3000); // Redirigir despues de 3 segundos
      setEmail('');
      setPassword('');

    } catch (error: any) {
      console.error('Error en la petición de registro:', error);
      setMessage(error.message || 'Error de conexión o del servidor al intentar registrar.');
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
          className='border border-solid border-black'
          type="submit"
        >
          Registrarme
        </button>
      </form>
      {message && <p>{message}</p>}

      {/* Más adelante irá el formulario de Login y el botón de Google */}
    </div>
  );
}
