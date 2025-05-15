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

// El simple hecho de importar este archivo ejecuta el 'init' que está dentro.
import '@/utils/onboardConfig';
import METLABS_CONTRACT_ABI from '@/abis/metlabsContractABI.json';
import { METLABS_CONTRACT_ADDRESS } from '@/utils/constants';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';

export default function ProfilePage() {
  // Hooks estándar de web3-onboard
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const connectedWallets = useWallets(); // Array de wallets conectadas (normalmente solo una)

  // Estado que guarda el provider y el signer
  const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

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
            userAddress:signerAddress
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
            userAddress:signerAddress
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

  return (
    <>
      <div>
        <h1>Perfil de Usuario</h1>

        {!wallet ? (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="border border-solid border-blue-500 text-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors"
          >
            {connecting ? 'Conectando...' : 'Conectar Wallet'}
          </button>
        ) : (
          <div>
            <h2>Wallet Conectada:</h2>
            <p><strong>Wallet:</strong> {wallet.label}</p>
            <p><strong>Dirección:</strong> {wallet.accounts[0]?.address}</p>
            <p><strong>Red:</strong> {wallet.chains[0]?.id} (Asegúrate que sea Sepolia: 0xaa36a7)</p>
            <button
              onClick={handleDisconnect}
              className="border border-solid border-red-500 text-red-500 rounded px-4 py-2 hover:bg-red-500 hover:text-white transition-colors mt-2"
            >
              Desconectar Wallet ({wallet.accounts[0]?.address.substring(0, 6)}...)
            </button>

            {/* Aquí irán los botones de Depositar/Retirar y la info del balance */}
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>Acciones del Contrato (Próximamente)</h3>
              {/* Aquí pondrás los botones y la lógica para interactuar con tu Smart Contract */}
              <p>Balance en el contrato: {balance || 'Cargando...'}</p>
              <button className="border p-2 m-1">Depositar (Próximamente)</button>
              <button className="border p-2 m-1">Retirar (Próximamente)</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Datos del Usuario (Cargados del Backend - Próximamente)</h3>
          {/* Aquí mostrarás los datos que vienen de tu API del backend */}
          <p>Email: (Próximamente)</p>
          <p>ID de Usuario: (Próximamente)</p>
        </div>

        {/* Resto de la maquetación de Figma (sin funcionalidad por ahora) */}
      </div>


      <div>
        <h1>Perfil de Usuario</h1>
        {/* ... (tu UI de conexión de wallet) ... */}
        {!wallet ? (<p>Conecta tu wallet para interactuar con el contrato.</p>) : (
          <div>
            {/* ... info de la wallet ... */}
            <p>Signer Address: {signerAddress || 'No disponible'}</p>

            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>Acciones del Contrato</h3>
              {contract ? (
                <>
                  <button
                    onClick={handleDeposit}
                    className="border p-2 m-1 bg-green-500 text-white cursor-pointer"
                  >
                    Depositar
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="border p-2 m-1 bg-red-500 text-white cursor-pointer"
                  >
                    Retirar
                  </button>
                  <p>Balance en el contrato: {balance || 'No disponible'}</p>
                </>
              ) : (
                <p>Conecta tu wallet y asegúrate de estar en Sepolia para interactuar con el contrato.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

