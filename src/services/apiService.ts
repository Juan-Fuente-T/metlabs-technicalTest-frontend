// src/services/apiService.ts
import { API_BASE_URL } from "@/utils/constants";
interface RegisterPayload {
    email: string;
    password: string;
}
interface UserResponseData { // Lo que devuelve el backend para un usuario
    id: string;
    email: string;
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

interface TransactionPayload {
    transactionHash: string;
    userAddress: string;
    type: string;
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


interface UserProfileData extends UserResponseData {
  id: string;
  email: string;
  walletAddress?: string; 
    // otros campos del perfil que devuelva el backend
}

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
    },
    transactions: {
        add: async (payload: TransactionPayload): Promise<AddTransactionResponse> => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/transactions`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
        getProfile: async (userId: string): Promise<UserProfileData> => { 
            // const token = localStorage.getItem('authToken'); // TRAS IMPLEMENTAR JWT
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`, // TRAS IMPLEMENTAR JWT
                    },
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