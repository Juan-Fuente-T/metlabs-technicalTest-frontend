// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser { 
  id: string;
  email: string;
  // walletAddress?: string; // Opcional
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, userData?: AuthUser) => void; 
  logout: () => void;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia cargando

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      setToken(storedToken);
     }
    setIsLoading(false); 
  }, []);

  const login = (newToken: string, userData?: AuthUser) => {
    console.log("Token en login:", newToken);
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    if (userData) {
      // localStorage.setItem('authUser', JSON.stringify(userData)); // Opcional
      setUser(userData);
    }
    // Se podría querer cargar los datos del usuario desde el backend aquí usando el token
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    // localStorage.removeItem('authUser'); // Opcional
    setToken(null);
    setUser(null);
    // Se podría redirigir al login, ej. router.push('/login') 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};