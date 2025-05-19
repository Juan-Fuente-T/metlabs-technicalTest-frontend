//IMPORTANTE
"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {LuEyeOff, LuEye} from 'react-icons/lu';

interface AuthFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onLoginSubmit: () => Promise<void>; 
  onRegisterSubmit: () => Promise<void>; 
  acceptTerms: boolean; 
  setAcceptTerms: (value: boolean) => void; 
}

export default function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  onLoginSubmit,
  onRegisterSubmit,
  acceptTerms,
  setAcceptTerms
}: AuthFormProps) {
 const [showPassword, setShowPassword] = useState(false);

 const primaryButtonClass = "w-full flex justify-center py-2 px-4 border rounded-xl shadow-sm text-base font-medium text-white bg-[#1D1E41] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D1E41] cursor-pointer " + // Espacio al final
 "disabled:bg-[#EFEFF2] disabled:text-[#A0A1AF] disabled:border-[#A0A1AF] disabled:shadow-none disabled:cursor-not-allowed";
 const secondaryButtonClass = "w-full flex justify-center py-2 px-6 border border-[#1D1E41]  rounded-xl shadow-sm text-lg font-semibold text-[#1D1E41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D1E41]  transition-colors cursor-pointer";
 

 const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms) { // Solo permite login si los términos están aceptados
        toast.error("Debes aceptar los términos y condiciones.");
        // alert("Debes aceptar los términos y condiciones para iniciar sesión."); // Simple alert
        return;
    }
    onLoginSubmit();
  };

 return (
    <div> 
      <h1 className="text-start text-5xl font-bold tracking-tight text-[#1D1E41] mb-6">
        ¡Bienvenido! 
      </h1>
      <form className="space-y-5" onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="auth-email" className="block text-sm font-medium text-[#1D1E41] mb-1">
            Correo electrónico <span className="text-[#EE731B]">*</span> {/* Asterisco naranja */}
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full  px-4 py-2 border border-[#BBBBC6] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#EE731B] focus:border-[#EE731B] sm:text-sm"
            placeholder="example@example.com"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="auth-password" className="block text-sm font-medium text-[#1D1E41]">
              Contraseña <span className="text-[#EE731B]">*</span> {/* Asterisco naranja */}
            </label>
          </div>
          <div className="relative">
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-4 pr-10 py-2 border border-[#BBBBC6] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#EE731B] focus:border-[#EE731B] sm:text-sm"
              placeholder="********"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-[#EE731B]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
          </div>
          <div className="flex justify-start mt-4">
            <p className="text-xs text-gray-500">
              ¿Has olvidado tu contraseña?{' '}
              <Link href="#" className="font-medium text-[#EE731B] hover:underline">
                Recuperar.
              </Link>
            </p>
          </div>
        </div>

        {/* Checkbox de Términos */}
        <div className="flex items-start"> 
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-[#1D1E41] border-white rounded focus:ring-[#EE731B]"
            />
          </div>
          <div className="ml-3 text-xs">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Acepto los <Link href="#" className="text-[#1D1E41] hover:underline">términos y condiciones de privacidad</Link>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className={`${primaryButtonClass}`}
          disabled={!acceptTerms} 
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}