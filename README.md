# Metlabs - Prueba Técnica Frontend

Este repositorio contiene el código del frontend para la prueba técnica de Metlabs, desarrollado por Juan Fuente. Esta aplicación interactúa con un backend separado para la gestión de usuarios y datos.

## Descripción

El frontend es una aplicación web construida con Next.js (App Router), React y TypeScript. Proporciona la interfaz de usuario para el registro, inicio de sesión (incluyendo Google Login), gestión del perfil de usuario, conexión de wallet Web3, e interacción con un smart contract en la red Sepolia para operaciones de depósito, retiro y consulta de balance. El diseño se basa en las especificaciones de un archivo Figma proporcionado.

## Funcionalidades Implementadas

* **Página de Login/Registro:**
    * Formulario para registro e inicio de sesión con email y contraseña.
    * Botón para "Iniciar sesión con Google" (OAuth 2.0).
    * Notificaciones (toasts) para feedback al usuario.
    * Redirección al perfil tras un login/registro exitoso.
* **Página de Perfil de Usuario (Ruta Protegida):**
    * Carga y muestra datos del usuario autenticado desde el backend.
    * Conexión y desconexión de wallet Web3 usando `@web3-onboard`.
    * Muestra de la dirección de la wallet conectada y red.
    * Funcionalidad para "Depositar" (llama a la función `increaseBalance` del smart contract).
    * Funcionalidad para "Retirar" (llama a la función `balanceDecrease` del smart contract).
    * Visualización del balance del usuario obtenido desde la función `balanceForUsers` del smart contract.
    * Guardado del hash de las transacciones de depósito/retiro en el backend.
    * Botón de "Cerrar Sesión".
* **Navegación y UI:**
    * Navbar con enlaces y estado condicional (logueado/no logueado, wallet conectada/no conectada).
    * Footer simple.
    * Estilos con Tailwind CSS buscando aproximarse al diseño Figma proporcionado.
    * Manejo de estado de autenticación global mediante React Context.

## Tecnologías Utilizadas

* **Next.js (App Router):** Framework de React para desarrollo frontend.
* **React:** Librería para construir interfaces de usuario.
* **TypeScript:** Superset de JavaScript para tipado estático.
* **Tailwind CSS:** Framework CSS para diseño rápido de UI.
* **@web3-onboard/react:** Para la conexión de wallets Web3.
* **ethers.js (v6):** Para interactuar con la blockchain Ethereum (smart contracts).
* **@react-oauth/google:** Para la funcionalidad de "Iniciar sesión con Google".
* **sonner:** Para notificaciones toast.
* **ESLint:** Para el linting de código.
*

## Prerrequisitos

* Node.js (v18.x o v20.x recomendado)
* npm (viene con Node.js)
* Una wallet Web3 compatible con Ethereum (ej. MetaMask) configurada para la red de pruebas Sepolia y con algo de Sepolia ETH para las transacciones.
* El [Backend de Metlabs](https://github.com/Juan-Fuente-T/metlabs-technicalTest-backend) debe estar configurado y ejecutándose.

## Configuración y Puesta en Marcha

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Juan-Fuente-T/metlabs-technicalTest-frontend.git
    cd frontend
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto (`frontend/.env.local`). Necesitarás las siguientes variables:

    ```env
    # .env.local.example - Copia esto a un archivo .env.local y rellena los valores

    # URL base donde corre tu API backend
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 

    # ID de Cliente de Google OAuth 2.0 (obtenido de Google Cloud Console)
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_ID_DE_CLIENTE_DE_GOOGLE_AQUI

    # URL del nodo RPC para la red Sepolia (obtenida de Infura, Alchemy, QuickNode, etc.)
    # Necesaria para que web3-onboard interactúe con la red.
    NEXT_PUBLIC_SEPOLIA_RPC_URL=TU_URL_RPC_SEPOLIA_AQUI
    ```

## Ejecutar la Aplicación

1.  **Asegúrate de que el servidor backend esté corriendo** (normalmente en `http://localhost:3000`).
2.  Inicia el servidor de desarrollo del frontend:
    ```bash
    npm run dev
    ```
3.  Abre tu navegador y ve a `http://localhost:3001`.

## Flujo de la Aplicación

* El usuario puede registrarse o iniciar sesión con email/contraseña o con Google.
* Tras autenticarse, es redirigido a la página de perfil.
* En el perfil, puede conectar su wallet MetaMask (u otra compatible).
* Una vez conectada la wallet y estando en la red Sepolia, puede ver su balance en el contrato y realizar operaciones de depósito y retiro.
* Las transacciones de depósito/retiro se registran en el backend.

## Despliegue

Como el despliegue era opcional para esta prueba, esta aplicación frontend está configurada para ejecución local. Para un despliegue en producción, se recomienda **Vercel**, ya que ofrece una integración óptima con Next.js. Sería necesario configurar las variables de entorno en la plataforma Vercel.

## Autor

Juan Fuente