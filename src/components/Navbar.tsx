// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Ajusta la ruta si es necesario
import { useConnectWallet, useWallets } from '@web3-onboard/react'; // Hooks de Onboard
import React, { useState, useEffect, useRef } from 'react'; // Hooks de React

export default function Navbar() {
    const { user, logout, isLoading: authIsLoading } = useAuth();
    const [{ connecting: walletIsConnecting }, connect, disconnect] = useConnectWallet();
    const connectedWallets = useWallets();

    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const primaryWallet = connectedWallets.length > 0 ? connectedWallets[0] : null;

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        if (primaryWallet) { // Opcional: desconectar también la wallet cripto al hacer logout de la app
            disconnect(primaryWallet);
        }
        router.push('/login');
    };

    const handleToggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Efecto para cerrar el desplegable si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="bg-slate-800 px-12 shadow-lg sticky top-0 z-50">
            <div className="w-full  sm:px-6 lg:px-8 flex justify-between items-center h-16"> 
                {/* Sección Izquierda: Logo y Links */}
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Logo {/* Placeholder para el logo */}
                          {/* <Image src="/ruta/al/logo.svg" alt="Metlabs Test Logo" width={100} height={40} /> */}
                    </Link>
                    <Link href="#" className="text-white">
                        Catálogo
                    </Link>
                    <Link href="#" className="text-white">
                        Quiénes Somos
                    </Link>
                    <Link href="#" className="text-white">
                        Soporte
                    </Link>
                </div>

                {/* Sección Derecha: Condicional */}
                <div className="flex items-center space-x-4">
                    {authIsLoading ? (
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div> // Placeholder de carga
                    ) : user ? (
                        // --- Usuario Logueado en la APP ---
                        <>
                            {/* Botón Conectar Wallet / Info de Wallet Conectada */}
                            {!primaryWallet ? (
                                <button
                                    onClick={() => connect()} // Llama a la función connect de useConnectWallet
                                    disabled={walletIsConnecting}
                                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {walletIsConnecting ? 'Conectando Wallet...' : 'Conectar Wallet'}
                                </button>
                            ) : (
                                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                                    <span className="text-xs text-green-600 font-semibold">Wallet:</span>
                                    <span className="text-xs text-gray-700">
                                        {primaryWallet.accounts[0].address.substring(0, 6)}...{primaryWallet.accounts[0].address.substring(primaryWallet.accounts[0].address.length - 4)}
                                    </span>
                                    <button
                                        onClick={() => disconnect(primaryWallet)}
                                        className="text-xs text-red-500 hover:text-red-700"
                                        title="Desconectar Wallet"
                                    >
                                        (x)
                                    </button>
                                </div>
                            )}

                            {/* Avatar y Menú Desplegable del Usuario */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={handleToggleDropdown}
                                    className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    {user.email ? user.email.substring(0, 1) : 'U'}
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1 border border-gray-200">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                            onClick={() => setIsDropdownOpen(false)} // Cierra al hacer clic
                                        >
                                            Mi Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // --- Usuario NO Logueado en la APP ---
                        <>
                            <Link href="/login" className="py-2 px-4 rounded-md text-sm font-medium text-white border border-white hover:bg-white hover:text-slate-900">
                                Login
                            </Link>
                            <Link href="/login"   className="py-2 px-4 rounded-md text-sm font-medium text-white hover:border border-white  ">
                                Iniciar sesión
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}