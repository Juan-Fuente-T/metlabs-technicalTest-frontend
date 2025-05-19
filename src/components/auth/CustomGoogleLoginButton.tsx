
"use client";

import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService'; 
import { useAuth } from '@/context/AuthContext';  
import { useRouter } from 'next/navigation';

export default function GoogleSignInButton() {
  const { login } = useAuth();
  const router = useRouter();

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

  return (
    <div className="flex justify-center"> 
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        theme="outline"
        shape="pill" // O "pill"
        size="large"      // O "medium"
        width="350px"     // Ajustar ancho
        locale='es'
        text="continue_with"
        logo_alignment="left"
      />
    </div>
  );
}