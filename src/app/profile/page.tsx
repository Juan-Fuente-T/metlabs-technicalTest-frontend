// // app/profile/page.tsx o src/app/profile/page.tsx
// export default function ProfilePage() {
//   return (
//     <div>
//       <h1>Perfil de Usuario</h1>
//       <p>Aquí se mostrará la información del usuario, wallet, balance, y acciones.</p>
//       {/* Más adelante aquí irá conexión de wallet, etc. */}
//     </div>
//   );
// }

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
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';
import Sidebar from '@/components/Sidebar';
interface UserProfileData {
  id: string;
  email: string;
  walletAddress?: string;
}

export default function ProfilePage() {
  const { user: authUser, token, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  // Hooks estándar de web3-onboard
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const connectedWallets = useWallets(); // Array de wallets conectadas (normalmente solo una)
  const primaryWallet = connectedWallets.length > 0 ? connectedWallets[0] : null;

  // Estado que guarda el provider y el signer
  const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null);
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
          setEthersProvider(provider);

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

          console.log('Ethers Provider y Signer configurados.');
          console.log('Dirección del Signer:', address);
        } catch (error) {
          console.error('Error al configurar Ethers.js:', error);
          setEthersProvider(null);
          setSignerAddress(null);
          setContract(null);
        }
      } else {
        setEthersProvider(null);
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
  const handleConnect = async () => {
    // El segundo parámetro de connect() es opcional, para forzar una wallet específica o auto-seleccionar
    // Si no se pasa, muestra el modal para que el usuario elija.
    connect();
  };
  
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
          setProfileData({ id: authUser.id, email: authUser.email, walletAddress: signerAddress || ''});
          
          // Si la wallet ya está conectada (viene de useConnectWallet), usamos su dirección
          if(primaryWallet?.accounts[0]?.address) {
            setSignerAddress(primaryWallet.accounts[0].address);
          }

        } catch (error) {
          toast.error("No se pudo cargar la información del perfil.");
        }
      };
      fetchProfile();
    }
  }, [token, authIsLoading, authUser, router, signerAddress]); 


  const handleDisconnect = async () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  // EJEMPLO de cómo llamarías a una función del contrato más adelante:
  const handleDeposit = async () => {
    if (contract) {
      try {
        const tx = await contract.increaseBalance();
        console.log('Transacción de depósito enviada:', tx.hash);
        await tx.wait();
        console.log('Transacción de depósito minada!');
        toast.success('Depósito completado con éxito');
        // Aquí guardarías tx.hash y la dirección del usuario en tu backend
        // y actualizarías el balance del usuario en la UI
        const newBalance = await contract.balanceForUsers(signerAddress);
        console.log('Nuevo balance en el contrato:', newBalance.toString());
        setBalance(newBalance.toString());
        try {
          if (!signerAddress) {
            throw new Error('No se pudo obtener la dirección del signer.');
          }
          await apiService.transactions.add({ 
            transactionHash: tx.hash, 
            userAddress:signerAddress,
            type: 'deposit'
          });
          toast.success('Hash de la transacción guardado en el backend.');
        } catch (backendError) {
          console.error("Error guardando hash en backend:", backendError);
          toast.error('EL Hash de transacción no pudo ser guardado en el backend.');
        }
      } catch (error: any) {
        console.error("Error al 'retitar' (increaseBalance):", error);
        toast.dismiss('deposit-tx'); // Cierra el toast de carga si existe
        let errorMessage = "Error al procesar el depósito.";
        if (error.message) {
          errorMessage = error.message;
        }
        console.log("Error message:", error);
        if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.reason) {
          errorMessage = error.reason;
        }
        toast.error(errorMessage);
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
            userAddress:signerAddress,
            type: 'withdraw'
          });
          toast.success('Hash de la transacción guardado en el backend.');
        } catch (backendError) {
          console.error("Error guardando hash en backend:", backendError);
          toast.error('EL Hash de transacción no pudo ser guardado en el backend.');
        }
      } catch (error: any) {
        console.error("Error al 'retitar' (balanceDecrease):", error);
        toast.dismiss('withdraw-tx'); // Cierra el toast de carga si existe
        let errorMessage = "Error al procesar el retiro.";
        if (error.message) {
          errorMessage = error.message;
        }
        console.log("Error message:", error);
        if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.reason) {
          errorMessage = error.reason;
        }
        toast.error(errorMessage);
      }
    }
  }

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
      <main className="flex-grow p-6 bg-gray-50 overflow-y-auto"> 
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Contenido Principal del Perfil</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Mis Datos (del Backend)</h2>
          <p>Email: {profileData?.email || authUser?.email}</p>
          <p>User ID: {profileData?.id || authUser?.id}</p>
          <p>Wallet registrada en perfil: {profileData?.walletAddress || 'No registrada'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Otras Acciones o Información</h2>
          <p>Podría ir más contenido específico de la página de perfil.</p>
          {/* Ejemplo, un historial de transacciones obtenido del backend */}
        </div>
      </main>
    </div>
  );
}

