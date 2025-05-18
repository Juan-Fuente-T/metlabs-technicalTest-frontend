// src/components/Sidebar.tsx
"use client"; // Si va a tener interacciones o usar hooks como usePathname

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // usePathname para resaltar el link activo
import { useAuth } from '@/context/AuthContext'; // Para el logout
import { useConnectWallet, useWallets } from '@web3-onboard/react'; // Para el botón de conectar wallet si lo pones aquí
import React from 'react';

// Importa los iconos que necesites de react-icons
import {
  LuLayoutDashboard,
  LuCircle,
  LuShieldCheck,
  LuBadgeCheck,
  LuWallet,
  LuBell,
  LuLogOut,
  LuArrowDownToLine, // Icono para Depositar
  LuArrowUpFromLine, // Icono para Retirar
  LuCopy,            // Icono para copiar dirección
} from 'react-icons/lu'; // Lucide Icons (una buena colección de react-icons)

// Tipos para los props si el Sidebar necesita manejar funciones o datos del padre
interface SidebarProps {
  balance?: string | null; // Saldo disponible a mostrar
  userAddress?: string | null; // Dirección de la wallet conectada
  onDeposit?: () => void; // Función para cuando se hace clic en depositar
  onWithdraw?: () => void; // Función para cuando se hace clic en retirar
}

export default function Sidebar({ balance, userAddress, onDeposit, onWithdraw }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Para saber qué ruta está activa

  // Los hooks de web3-onboard por si quieres el botón de conectar/desconectar aquí también
  // const [{ wallet: onboardWallet, connecting: walletIsConnecting }, connect, disconnect] = useConnectWallet();
  const [, ,disconnect] = useConnectWallet();
  const connectedWallets = useWallets();
  const primaryWallet = connectedWallets.length > 0 ? connectedWallets[0] : null;


  const handleLogout = () => {
    logout();
    if (primaryWallet) disconnect(primaryWallet);
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard }, // Asumiendo que /profile es tu dashboard
    { href: '/profile', label: 'Perfil', icon: LuCircle },
    { href: '/profile/seguridad', label: 'Seguridad', icon: LuShieldCheck },
    { href: '/profile/verificacion', label: 'Verificación', icon: LuBadgeCheck },
    { href: '/profile/cartera', label: 'Cartera', icon: LuWallet },
    { href: '/profile/notificaciones', label: 'Notificaciones', icon: LuBell },
  ];

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      // Aquí podrías usar un toast para confirmar "Dirección copiada"
      alert("Dirección copiada al portapapeles"); // Placeholder simple
    }
  };

  return (
    <aside className="w-72 bg-white p-6 shadow-lg flex flex-col h-full border-r border-gray-200"> {/* Ancho y estilos base del sidebar */}
      {/* Sección Saldo y Acciones */}
      <div className="bg-slate-50 p-4 rounded-xl mb-8 shadow">
        <p className="text-sm text-gray-500 mb-1">Saldo disponible</p>
        <p className="text-3xl font-bold text-slate-800 mb-2">
          {balance !== null && balance !== undefined ? `$ ${parseFloat(balance).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` : 'Cargando...'}
        </p>
        {userAddress && (
          <div className="flex items-center text-xs text-gray-400 mb-4">
            <span>{userAddress.substring(0, 8)}...{userAddress.substring(userAddress.length - 6)}</span>
            <button onClick={copyAddress} title="Copiar dirección" className="ml-2 hover:text-indigo-600">
              <LuCopy size={14} />
            </button>
          </div>
        )}
        <div className="space-y-3">
          <button 
            onClick={onDeposit}
            className="w-full flex items-center justify-center bg-slate-800 text-white py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors"
            disabled={!userAddress} // Deshabilitar si no hay wallet conectada
          >
            <LuArrowDownToLine className="mr-2" /> Depositar
          </button>
          <button 
            onClick={onWithdraw}
            className="w-full flex items-center justify-center bg-slate-800 text-white py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors"
            disabled={!userAddress} // Deshabilitar si no hay wallet conectada
          >
            <LuArrowUpFromLine className="mr-2" /> Retirar
          </button>
        </div>
      </div>

      {/* Sección de Navegación */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 p-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                  pathname === item.href ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600'
                }`}
              >
                <item.icon size={20} className={`${pathname === item.href ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sección de Cerrar Sesión */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LuLogOut size={20} className="text-gray-400 group-hover:text-red-500" /> {/* Puse group-hover pero no hay grupo, ajusta si es necesario */}
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}