// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

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

    const toggleUserDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const btnPrincipal = "w-auto h-[40px] flex items-center justify-center py-2 px-6 rounded-xl border-2 bg-transparent border-white text-white text-md font-semibold transition-colors hover:border-[#EE731B]";
    const btnTerciario = "w-auto h-[40px] flex items-center justify-center py-2 px-6 rounded-xl border-2 border-transparent text-white text-md font-semibold transition-colors hover:border-[#EE731B]";
    const btnOutlineBorder = 'border-white hover:';
    const btnOutlineText = 'text-white hover:';


    return (
        <div className="bg-[#1D1E41] shadow-lg sticky top-0 z-50"> {/* Fondo oscuro principal */}
            <div className="">
                <div className="flex items-center justify-between py-4 px-4 sm:px-6 md:px-8 lg:px-20">

                    {/* Sección Izquierda: Logo y Links de Navegación (Desktop) */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 cursor-pointer">
                            <Image src="/LOGO.png" alt="Logo Metlabs" width={143} height={38} />
                        </Link>
                        {/* Links de Navegación para Desktop */}
                        <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                            <Link href="#" className="text-white px-3 py-2 rounded-md text-lg font-semibold">
                                Catálogo
                            </Link>
                            <Link href="#" className="text-white px-3 py-2 rounded-md text-lg font-semibold">
                                Quiénes somos
                            </Link>
                            <Link href="#" className="text-white px-3 py-2 rounded-md text-lg font-semibold">
                                Soporte
                            </Link>
                        </div>
                    </div>

                    {/* Sección Derecha (Desktop): Idioma, Autenticación, Avatar */}
                    <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
                        {/* Botón de Idioma */}
                        <button className="w-12 h-12 flex items-center justify-center focus:outline-none flex-shrink-0">
                            <Image src="/icons/BanderaES.png" alt="Idioma" width={32} height={32} />
                        </button>

                        {authIsLoading ? (
                            <div className="h-8 w-24 bg-primary-darker rounded animate-pulse"></div>
                        ) : user ? (
                            // Usuario Logueado
                            <>
                                {!primaryWallet ? (
                                    <button
                                        onClick={() => connect()}
                                        disabled={walletIsConnecting}
                                        // className={`${btnPrincipalBg} ${btnPrincipalText} text-sm font-medium py-2 px-3 rounded-md transition-colors`}
                                        className={`${btnPrincipal}`}                                    >
                                        {walletIsConnecting ? 'Conectando...' : 'Conectar Wallet'}
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-1 bg-primary-lighter p-1 rounded-lg"> {/* OJO. Ajustar colores */}
                                        <span className="text-xs text-white font-semibold pl-1">✓</span>
                                        <span className="text-xs text-white">
                                            {primaryWallet.accounts[0].address.substring(0, 6)}...{primaryWallet.accounts[0].address.substring(primaryWallet.accounts[0].address.length - 4)}
                                        </span>
                                        <button
                                            onClick={() => disconnect(primaryWallet)}
                                            // className="w-[175px] h-[40px] flex items-center justify-center py-2 px-6 rounded-xl border-2 bg-transparent border-white text-white text-lg font-semibold transition-colors hover:border-[#EE731B]"
                                            className="text-xs text-white hover:text-white px-1 rounded-md"
                                            title="Desconectar Wallet"
                                        >
                                            (x)
                                        </button>
                                    </div>
                                )}
                                {/* Avatar y Dropdown de Usuario */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="w-8 h-8 flex focus:outline-none cursor-pointer"
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        {/* <Image className="h-8 w-8 rounded-full" src={'/avatar-default.png'} alt="Avatar de usuario" width={32} height={32} /> */}
                                        <Image
                                            src="/icons/Avatar.png"
                                            alt="Avatar de usuario"
                                            width={32}
                                            height={32}
                                        />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                                Mi Perfil
                                            </Link>
                                            <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Usuario NO Logueado
                            <>
                                {/* <Link href="/login#registrarse" // Asumiendo que tienes un ancla para el form de registro
                                    className={`${btnPrincipal}`}
                                >
                                    Registrarse
                                </Link>
                                <Link href="/login"
                                    className={`${btnPrincipal}`}
                                >
                                    Iniciar sesión
                                </Link> */}
                                <button
                                    onClick={() => router.push('/login#registrarse')}
                                    className={btnPrincipal} 
                                >
                                    Registrarse
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className={btnTerciario} 
                                >
                                    Iniciar sesión
                                </button>
                            </>
                        )}
                    </div>

                    {/* Botón de Hamburguesa para Móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            id="mobile-menu-button"
                            onClick={toggleMobileMenu}
                            // className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            className="border-2 border-white inline-flex items-center justify-center w-[48px] h-[40px] rounded-xl cursor-pointer"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMobileMenuOpen ? (
                                <Image src="/icons/Salir.png" alt="Cerrar menú"
                                    width={24} height={24}
                                />
                            ) : (
                                <Image src="/icons/Menu2.png" alt="Abrir menú" width={24} height={24}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Desplegable para Móvil (Drawer) */}
            {isMobileMenuOpen && (
                // <div className="md:hidden w-[300px] flex justify-end" id="mobile-menu" ref={mobileMenuRef}>
                <div className="md:hidden w-full h-full flex justify-end">
                    {/* Contenedor del menú móvil */}
                    <div className="fixed top-[72px] left-0 right-0 bottom-0 bg-[#1D1E41]/[0.30] z-40 md:hidden" onClick={toggleMobileMenu}></div>
                    <div className={`
                        fixed top-[72px] right-0 bottom-0 w-[300px] z-50 md:hidden 
                        bg-[#1D1E41] justify-between  shadow-xl overflow-y-auto 
                        transition-transform duration-300 ease-in-out pb-20 pt-10
                        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                        flex flex-col
                        `} id="mobile-menu" ref={mobileMenuRef}>
                        <div className="px-10">
                            <Link href="#"
                                className="block px-3 py-2 rounded-md text-white hover:text-white hover:bg-[#123456] font-semibold text-lg leading-[26px] tracking-normal"
                            >Catálogo</Link>
                            <Link href="#" className="text-white  block px-3 py-2 rounded-md text-lg font-semibold">Quiénes somos</Link>
                            <Link href="#" className="text-white  block px-3 py-2 rounded-md text-lg font-semibold">Soporte</Link>
                        </div>
                        {/* Contenido de autenticación y otros para el menú móvil */}
                        <div className="px-10">
                            {authIsLoading ? (
                                <div className=""><div className="h-8 w-full bg-primary-darker rounded animate-pulse"></div></div>
                            ) : user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="h-10 w-10 rounded-full"
                                                src="/icons/Avatar.png"
                                                alt="Avatar de usuario"
                                                width={32}
                                                height={32}
                                                />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-white">{user.email?.split('@')[0] || 'Usuario'}</div>
                                            <div className="text-sm font-medium text-white">{user.email}</div>
                                        </div>
                                    </div>
                                    {!primaryWallet ? (
                                        <button
                                            onClick={() => { connect(); setIsMobileMenuOpen(false); }}
                                            disabled={walletIsConnecting}
                                            className={`${btnPrincipal}`}
                                        >
                                            {walletIsConnecting ? 'Conectando Wallet...' : 'Conectar Wallet'}
                                        </button>
                                    ) : (
                                        <div className="text-xs text-white bg-primary-lighter p-2 rounded">
                                            Wallet: {primaryWallet.accounts[0].address.substring(0, 6)}...{primaryWallet.accounts[0].address.substring(primaryWallet.accounts[0].address.length - 4)}
                                            <button onClick={() => { disconnect(primaryWallet); setIsMobileMenuOpen(false); }} className="text-red-400 ml-2">(desconectar)</button>
                                        </div>
                                    )}
                                    <Link href="/profile" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary-lighter" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary-lighter">
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 flex flex-col items-center justify-center">
                                    <button
                                        className="h-10 w-full flex items-center justify-center py-2 px-6 rounded-xl border-2 border-white text-white cursor-pointer text-sm hover:border-[#EE731B] transition-colors"
                                    >
                                        <Image src="/icons/BanderaES.png" alt="Idioma" width={24} height={24} className="inline-block mr-2" />
                                        <span className="text-sm font-medium">Castellano</span>
                                    </button>
                                    <Link href="/login#registrarse"
                                        // className={`${btnPrincipalBg} ${btnPrincipalText} block w-full text-center text-sm font-medium py-2 px-3 rounded-md transition-colors`} 
                                        className="h-10 w-full flex items-center justify-center py-2 px-6 rounded-xl border-2 border-white text-white cursor-pointer text-sm hover:border-[#EE731B] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}>
                                        Registrarse
                                    </Link>
                                    <Link href="/login"
                                        // className={`${btnOutlineText} ${btnOutlineBorder} block w-full text-center text-sm font-medium py-2 px-3 rounded-md transition-colors`}
                                        className="h-10 w-full flex items-center justify-center py-2 px-6 rounded-xl border-2 border-white text-white cursor-pointer  text-sm hover:border-[#EE731B] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}>
                                        Iniciar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}