// src/components/Sidebar.tsx
"use client"; // Si va a tener interacciones o usar hooks como usePathname

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // usePathname para resaltar el link activo
import { useAuth } from '@/context/AuthContext'; // Para el logout
import { useConnectWallet, useWallets } from '@web3-onboard/react'; // Para el botón de conectar wallet si lo pones aquí
import React from 'react';
import Image from 'next/image';

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
import BalanceCard from './sidebar/BalanceCard';
import LogoutButton from './sidebar/LogoutButton';
import SidebarNavLinks from './sidebar/SidebarNavLinks';

// Tipos para los props si el Sidebar necesita manejar funciones o datos del padre
interface SidebarProps {
  balance?: string | null; 
  userAddress?: string | null;
  onDeposit?: () => void; 
  onWithdraw?: () => void; 
}

export default function Sidebar({ balance, userAddress, onDeposit, onWithdraw }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Para saber qué ruta está activa

  // Los hooks de web3-onboard para botón de conectar/desconectar wallet  
  // const [{ wallet: onboardWallet, connecting: walletIsConnecting }, connect, disconnect] = useConnectWallet();
  const [, , disconnect] = useConnectWallet();
  const connectedWallets = useWallets();
  const primaryWallet = connectedWallets.length > 0 ? connectedWallets[0] : null;


  const handleLogout = () => {
    logout();
    if (primaryWallet) disconnect(primaryWallet);
    router.push('/login');
  };

  const navItems = [
    // { href: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard }, 
    { href: '/dashboard', label: 'Dashboard', iconPath: '/icons/Dashboard.png' },
    // { href: '/profile', label: 'Perfil', icon: LuCircle },
    { href: '/profile', label: 'Perfil', iconPath: '/icons/Perfil.png' },
    // { href: '/profile/seguridad', label: 'Seguridad', icon: LuShieldCheck },
    { href: '/profile/seguridad', label: 'Seguridad', iconPath: '/icons/Seguridad.png' },
    // { href: '/profile/verificacion', label: 'Verificación', icon: LuBadgeCheck },
    { href: '/profile/verificacion', label: 'Verificación', iconPath: '/icons/Verificacion.png' },
    // { href: '/profile/cartera', label: 'Cartera', icon: LuWallet },
    { href: '/profile/cartera', label: 'Cartera', iconPath: '/icons/Cartera.png' },
    // { href: '/profile/notificaciones', label: 'Notificaciones', icon: LuBell },
    { href: '/profile/notificaciones', label: 'Notificaciones', iconPath: '/icons/Notificaciones.png' },
  ];

  // const copyAddress = () => {
  //   if (userAddress) {
  //     navigator.clipboard.writeText(userAddress);
  //     // Aquí podrías usar un toast para confirmar "Dirección copiada"
  //     alert("Dirección copiada al portapapeles"); // Placeholder simple
  //   }
  // };

  return (
    <aside className="bg-white w-[288px] h-[876px] p-4 shadow-lg flex flex-col justify-between overflow-y-auto">
      <BalanceCard
        balance={balance}
        userAddress={userAddress}
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
      />

      <SidebarNavLinks navItems={navItems} />

      <p className="border-b-1 border-[#EE731B] mb-4"></p>

      <LogoutButton onLogout={handleLogout} />
    </aside>
  );
}