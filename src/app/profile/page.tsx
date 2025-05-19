// Asegúrarse que sea un Client Component si se usa estado y event handlers
"use client"; // <--- MUY IMPORTANTE para usar hooks como useState y manejar eventos

import React, { useEffect, useState } from 'react';
import {
  useConnectWallet, // Hook para la función de conectar/desconectar
  useWallets,       // Hook para acceder a las wallets conectadas
  // useSetChain    // Hook para cambiar de red (opcion de futuro)
} from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// El simple hecho de importar este archivo ejecuta el 'init' que está dentro.
import '@/utils/onboardConfig';
import METLABS_CONTRACT_ABI from '@/abis/metlabsContractABI.json';
import { METLABS_CONTRACT_ADDRESS } from '@/utils/constants';
import { TRANSACTION_TYPES } from '@/utils/constants';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';
import Sidebar from '@/components/Sidebar';
import UserProfileCard from '@/components/profile/UserProfileCard';
interface UserProfileData {
  id: string;
  email: string;
  walletAddress?: string;
}

export default function ProfilePage() {
  const { user: authUser, token, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  // Hooks estándar de web3-onboard
  const [{ wallet }] = useConnectWallet();
  const connectedWallets = useWallets(); // Array de wallets conectadas (normalmente solo una)
  const primaryWallet = connectedWallets.length > 0 ? connectedWallets[0] : null;

  // Estado que guarda el provider y el signer
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  // Inicializa el provider y el signer cuando la wallet se conecta
  useEffect(() => {
    const setupEthers = async () => {
      if (wallet?.provider) {
        try {
          console.log('Detectado wallet.provider, configurando Ethers...');
          // Crea una nueva instancia de BrowserProvider con el provider de la wallet conectada.
          // El segundo argumento 'any' puede ayudar a evitar problemas si la red no coincide exactamente
          // o si Onboard ya está manejando la red. También puedes pasar el chainId de Sepolia si es necesario.
          const provider = new ethers.BrowserProvider(wallet.provider, 'any');

          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setSignerAddress(address);

          // Instancia del contrato 
          if (signer) {
            const contractInstance = new ethers.Contract(
              METLABS_CONTRACT_ADDRESS,
              METLABS_CONTRACT_ABI,
              signer
            );
            setContract(contractInstance);
            const balance = await contractInstance.balanceForUsers(address);
            console.log('Balance:', balance.toString());
            setBalance(balance.toString());
            console.log('Contrato de Metlabs instanciado:', contractInstance);
          }
        } catch (error) {
          console.error('Error al configurar Ethers.js:', error);
          setSignerAddress(null);
          setContract(null);
        }
      } else {
        setSignerAddress(null);
        setContract(null);
      }
    };
    // Llamar a la función async definida en el useEffect
    setupEthers();

    // Opcional: Función de limpieza
    // Si hubiese suscripciones o algo que limpiar cuando el componente se desmonta o 'wallet' cambia,
    // se haría aquí. Para este caso, no es estrictamente necesario.
    // return () => {
    //   // Código de limpieza si es necesario
    // };

  }, [wallet, balance]);


  // Effect para proteger ruta y cargar datos del perfil del backend
  useEffect(() => {
    if (!authIsLoading && !token) {
      router.push('/login');
    } else if (token && authUser) {
      const fetchProfile = async () => {
        try {
          // Usa el authUser.id para cargar el perfil, o un endpoint /me
          // Por ahora, si AuthContext ya tiene datos del user, se usan.
          // Si no, aquí iría la llamada a apiService.userProfile. getProfile(authUser.id)
          // y luego setProfileData(dataDelBackend);
          // Este ejemplo, simula que profileData se carga o es el mismo que authUser
          setProfileData({ id: authUser.id, email: authUser.email, walletAddress: signerAddress || '' });

          // Si la wallet ya está conectada (viene de useConnectWallet), usamos su dirección
          if (primaryWallet?.accounts[0]?.address) {
            setSignerAddress(primaryWallet.accounts[0].address);
          }

        } catch (error: unknown) { // Cambia 'any' o la ausencia de tipo por 'unknown'
          console.error("Error al cargar el perfil:", error);
          let errorMessage = 'El Hash de transacción no pudo ser guardado en el backend.';
          if (error instanceof Error) {
            // Si el error es una instancia de Error se puede acceder a error.message de forma segura.
            // A veces, los errores de 'fetch' o de librerías ya tienen un 'message' útil.
            errorMessage = error.message;
          }
          toast.error(errorMessage);
          // Aquí podría redirigirse al usuario a una página de error o mostrar un mensaje
        }
      };
      fetchProfile();
    }
  }, [token, authIsLoading, authUser, router, signerAddress, primaryWallet]);

  // Funciones para manejar el depósito y el retiro
  const handleDeposit = async () => {
    if (contract) {
      try {
        const tx = await contract.increaseBalance();
        console.log('Transacción de depósito enviada:', tx.hash);
        await tx.wait();
        console.log('Transacción de depósito minada!');
        toast.success('Depósito completado con éxito');
        // Atualiza el balance del usuario en la UI
        const newBalance = await contract.balanceForUsers(signerAddress);
        console.log('Nuevo balance en el contrato:', newBalance.toString());
        setBalance(newBalance.toString());
        // Guarda el tx.hash y la dirección del usuario en el backend
        try {
          if (!signerAddress || signerAddress === '') {
            throw new Error('No se pudo obtener la dirección del signer.');
          }
          await apiService.transactions.add({
            transactionHash: tx.hash,
            userAddress: signerAddress,
            type: TRANSACTION_TYPES.DEPOSIT
          });
          toast.success('Hash de la transacción guardado en el backend.');
        } catch (backendError) {
          console.error("Error guardando hash en backend:", backendError);
          toast.error('EL Hash de transacción no pudo ser guardado en el backend.');
        }
      } catch (error: unknown) {
        console.error("Error al 'retitar' (increaseBalance):", error);
        toast.dismiss('deposit-tx'); // Cierra el toast de carga si existe
        let errorMessage = "Error al procesar el depósito.";
        // Intenta extraer mensajes más específicos de errores de ethers.js o RPC
        if (typeof error === 'object' && error !== null) {
          // Ethers.js a menudo pone la razón del revert en 'reason' o info en 'data'
          // o el error mismo puede tener un mensaje útil si es un error de la librería.
          if ('reason' in error && typeof error.reason === 'string' && error.reason) {
            errorMessage = error.reason;
          }
          // Si no hay 'reason', pero hay 'message' en un objeto 'data'
          else if ('data' in error && typeof (error as { data?: { message?: string } }).data?.message === 'string' && (error as { data?: { message?: string } }).data?.message) {
            errorMessage = (error as { data: { message: string } }).data.message;
          }
          // Si no, pero el error es una instancia de Error, usamos su 'message'
          else if (error instanceof Error && error.message) {
            errorMessage = error.message;
          }
        }
        const finalErrorMessage = errorMessage || "Error al procesar el depósito.";
        toast.error(finalErrorMessage);
      }
    }
  };

  const handleWithdraw = async () => {
    if (contract) {
      try {
        const tx = await contract.balanceDecrease();
        console.log('Transacción de depósito enviada:', tx.hash);
        await tx.wait();
        console.log('Transacción de depósito minada!');
        toast.success('Retiro completado con éxito');
        const newBalance = await contract.balanceForUsers(signerAddress);
        console.log('Nuevo balance en el contrato:', newBalance.toString());
        setBalance(newBalance.toString());
        try {
          if (!signerAddress) {
            throw new Error('No se pudo obtener la dirección del signer.');
          }
          await apiService.transactions.add({
            transactionHash: tx.hash,
            userAddress: signerAddress,
            type: TRANSACTION_TYPES.WITHDRAW
          });
          toast.success('Hash de la transacción guardado en el backend.');
        } catch (backendError: unknown) {
          console.error("Error guardando hash en backend:", backendError);
          let errorMessage = 'El Hash de transacción no pudo ser guardado en el backend.';
          if (backendError instanceof Error) {
            errorMessage = backendError.message;
          }
          toast.error(errorMessage);
        }
      } catch (error: unknown) {
        console.error("Error al 'retitar' (balanceDecrease):", error);
        toast.dismiss('withdraw-tx'); // Cierra el toast de carga si existe
        let errorMessage = "Error al procesar el retiro.";
        if (typeof error === 'object' && error !== null) {
          // Ethers.js a menudo pone la razón del revert en 'reason' o info en 'data'
          // o el error mismo puede tener un mensaje útil si es un error de la librería.
          if ('reason' in error && typeof error.reason === 'string' && error.reason) {
            errorMessage = error.reason;
          }
          // Si no hay 'reason', pero hay 'message' en un objeto 'data'
          else if ('data' in error && typeof (error as { data?: { message?: string } }).data?.message === 'string' && (error as { data?: { message?: string } }).data?.message) {
            errorMessage = (error as { data: { message: string } }).data.message;
          }
          // Si no, pero el error es una instancia de Error, usamos su 'message'
          else if (error instanceof Error && error.message) {
            errorMessage = error.message;
          }
        }
        // Mensaje final para el toast
        const finalErrorMessage = errorMessage || "Error al procesar el retiro.";
        toast.error(finalErrorMessage);
      }
    }
  };

  if (authIsLoading) return <p className="text-center mt-10">Cargando sesión...</p>;
  if (!authUser && !token) return null; // Ya que el useEffect redirigirá

  return (
    <div className="flex h-screen">
      <Sidebar
        balance={balance}
        userAddress={signerAddress || primaryWallet?.accounts[0]?.address || profileData?.walletAddress}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
      <main className="flex-grow p-6 overflow-y-auto">
        <UserProfileCard profileData={profileData} />
      </main>
    </div>
  );
}

