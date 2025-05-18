// src/services/apiService.ts
import { API_BASE_URL } from "@/utils/constants";
interface RegisterPayload {
    email: string;
    password: string;
}
interface UserResponseData { // Lo que devuelve el backend para un usuario
    id: string;
    email: string;
    walletAddress?: string; //Opcional
}
interface RegisterResponse { // Respuesta del endpoint registro
    message: string;
    token: string;
    user: UserResponseData;
}

interface LoginResponse {
    message: string;
    token: string;
    user: UserResponseData;
}

interface GoogleLoginPayload { // La nueva interfaz que definimos arriba
    idToken: string;
  }

interface TransactionPayload {
    transactionHash: string;
    userAddress: string;
    // type: string;
    type: 'deposit' | 'withdraw';
}
interface TransactionData { // Lo que devuelve el backend para una transacción
    id: string;
    transactionHash: string;
    userAddress: string;
    type: string;
    createdAt: string;
}
interface AddTransactionResponse {
    message: string;
    transaction: TransactionData;
}


// interface UserProfileData extends UserResponseData {
//     // otros campos del perfil que devuelva el backend
// }

// --- FUNCIÓN PARA OBTENER CABECERAS CON AUTENTICACIÓN ---
const getAuthHeaders = () => {
    const headers: HeadersInit = { // HeadersInit es un tipo de TypeScript para las cabeceras
      'Content-Type': 'application/json',
    };
    // Verifica que está en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('[apiService] Token recuperado de localStorage:', token); 
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

export const apiService = {
    auth: {
        register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Error ${res.status}: Error al registrar`);
                }
                return data;
            } catch (error) {
                console.error("Error en apiService.auth.register:", error);
                throw error;
            }
        },
        login: async (payload: RegisterPayload): Promise<LoginResponse> => { 
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Error ${res.status}: Error al iniciar sesión`);
                }
                return data;
            } catch (error) {
                console.error("Error en apiService.auth.login:", error);
                throw error;
            }
        },
        loginWithGoogle: async (idToken: string): Promise<LoginResponse> => { 
            try {
              const payload: GoogleLoginPayload = { idToken };
              const res = await fetch(`${API_BASE_URL}/api/users/google-login`, {
                method: 'POST',
                headers: { // Este endpoint no necesita el token propio del backend, porque está creando una sesión
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });
      
              const data = await res.json();
              if (!res.ok) {
                throw new Error(data.message || `Error ${res.status}: Error en el login con Google`);
              }
              return data; // Espera que el backend devuelva { message, token, user }
            } catch (error) {
              console.error("Error en apiService.auth.loginWithGoogle:", error);
              throw error;
            }
          }
    },
    transactions: {
        add: async (payload: TransactionPayload): Promise<AddTransactionResponse> => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/transactions`, { 
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Error ${res.status}: Error al añadir la transacción`);
                }
                return data;
            } catch (error) {
                console.error("Error en apiService.transactions.add:", error);
                throw error;
            }
        },
    },
    userProfile: {
        getProfile: async (userId: string): Promise<UserResponseData> => { 
            // const token = localStorage.getItem('authToken'); // TRAS IMPLEMENTAR JWT
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, { 
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Error ${res.status}: Error al obtener perfil`);
                }
                return data;
            } catch (error) {
                console.error("Error en apiService.userProfile.getProfile:", error);
                throw error;
            }
        }
    }
};