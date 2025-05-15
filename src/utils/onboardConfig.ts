// src/lib/onboardConfig.ts
import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';

// Módulo para wallets inyectadas (MetaMask, etc.)
const injected = injectedModule();

// Public node RPC URL. solo para la prueba
// const RPC_URL_SEPOLIA = 'https://ethereum-sepolia-rpc.publicnode.com'; 
const RPC_URL_SEPOLIA = 'https://1rpc.io/sepolia'; 

if (!RPC_URL_SEPOLIA || RPC_URL_SEPOLIA === 'https://1rpc.io/sepolia') {
  console.warn(
    "Advertencia: RPC_URL_SEPOLIA no está configurada en onboardConfig.ts. La conexión de wallet podría no funcionar correctamente para interactuar con la red Sepolia."
  );
}

// Inicializar Onboard
export const onboard = init({
  wallets: [
    injected, // Añadir el módulo de wallets inyectadas
    // Aquí se podría añadir otros módulos de wallet(WalletConnect, Coinbase, etc.)
  ],
  chains: [
    {
      id: '0xaa36a7', // ID hexadecimal de la cadena Sepolia (11155111 en decimal)
      token: 'ETH',    
      label: 'Sepolia Testnet', 
      rpcUrl: RPC_URL_SEPOLIA,  
    },
    // Se podrían añadir otras cadenas aquí (ej. Ethereum Mainnet, Polygon, etc.)
  ],
  appMetadata: {
    name: 'Metlabs App Prueba',
    icon: '<svg>...</svg>', // Se podria poner un SVG simple aquí o una URL a un logo pequeño. Ejemplo: <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="blue"/></svg>
    description: 'Prueba técnica para Metlabs con conexión de wallet y ethers.js.',
    recommendedInjectedWallets: [ // Ayuda a Onboard a sugerir wallets si el usuario no tiene una
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
  },
  // Configuración opcional para el "Account Center" (donde el usuario ve su dirección y se desconecta)
  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: true,
      minimal: false, // 'true' lo hace más pequeño, 'false' muestra más detalles
    },
    mobile: {
      position: 'topRight',
      enabled: true,
      minimal: false,
    },
  },
  // Opcional: Para internacionalización si es necesario
  // i18n: {
  //   en: { /* ... */ },
  //   es: { /* ... */ }
  // }
});