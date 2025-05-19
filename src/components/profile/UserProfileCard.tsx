// src/components/profile/UserProfileCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';

interface UserProfileData {
  id: string;
  email: string;
  walletAddress?: string;
  // Posibles campos si el backend los devuelve:
  // name?: string;
  // phone?: string;
  // gender?: string;
  // birthDate?: string;
  // nationality?: string;
}

interface UserProfileCardProps {
  profileData: UserProfileData | null; // Datos del perfil cargados
  // onEdit?: () => void; // Función para Editar (deshabilitada por ahora)
}

// export default function UserProfileCard({ profileData, onEdit }: UserProfileCardProps) {
export default function UserProfileCard({ profileData }: UserProfileCardProps) {

  //Función para copiar al portapapeles
  const copyToClipboard = (text?: string) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success("Copiado al portapapeles"))
        .catch(() => toast.error("Error al copiar"));
    }
  };

  // Placeholder si no hay datos de perfil
  if (!profileData) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-[120px] h-[120px] rounded-lg bg-slate-200 flex-shrink-0"></div>
          <div className="flex-grow w-full space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Datos de ejemplo  para el profileData
  const name = profileData.email?.split('@')[0] || "Usuario Metlabs";
  const idDisplay = profileData.id?.substring(0, 8) || "N/A";
  const displayWallet = profileData.walletAddress || "No conectada";
  const displayEmail = profileData.email || "N/A";
  const phone = "+34 666 555 666"; // Placeholder
  const gender = "No especificado"; // Placeholder
  // const birthDate = "01/01/1990"; // Placeholder
  const counrty = "01/01/1990"; // Placeholder
  const birthPlace = "A Coruña"; // Placeholder
  const nationality = "Española"; // Placeholder


  return (
    <div className=" p-6 md:p-10  w-full max-w-3xl mx-auto"> {/* Sombra más pronunciada */}
      <h2 className="text-5xl font-bold text-[#1D1E41] mb-8">Mi perfil</h2>

      <div className="flex flex-col md:flex-row items-start md:space-x-10"> {/* Espacio entre imagen y detalles */}
        {/* Columna de la Imagen */}
        <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div
            className="w-[120px] h-[120px] rounded-lg bg-slate-200 flex items-center justify-center text-5xl text-slate-100 font-semibold overflow-hidden"
          // ^-- Estilo de la imagen según tus datos
          >
            <Image src={"/UserImage.png"} alt="Avatar de Usuario" width={120} height={120} className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Columna de los Detalles */}
        <div className="flex-grow w-full">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1D1E41] mb-1">{name}</h3>

          {/* Wallet */}
          {profileData?.walletAddress && (
            <div className="flex items-center text-sm text-[#1D1E41] mb-4"> {/* CAMBIARÉ COLOR SLATE -> text-gray-700 */}
              <span className="font-medium text-[#1D1E41]">Wallet:</span>
              {/* <span className="font-semibold ml-2 truncate" title={profileData.walletAddress}> */}
              <span className="font-semibold ml-2" title={profileData.walletAddress}>
                {/* {profileData.walletAddress.substring(0,10)}...{profileData.walletAddress.substring(profileData.walletAddress.length -8)} */}
                {profileData.walletAddress}
              </span>
              <button onClick={() => copyToClipboard(profileData.walletAddress)} title="Copiar wallet" className="ml-2 text-[#1D1E41] hover:text-[#EE731B] transition-colors">
                <LuCopy size={16} />
              </button>
            </div>
          )}
          {/* Resto de los campos en una columna */}
          <div className="space-y-4 text-sm">
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">ID</p>
              <p className="font-semibold text-[#1D1E41]">{idDisplay}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">Correo electrónico</p>
              <p className="font-semibold text-[#1D1E41] truncate">{displayEmail}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">Teléfono</p>
              <p className="font-semibold text-[#1D1E41]">{phone}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">Género</p>
              <p className="font-semibold text-[#1D1E41]">{gender}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">País de nacimiento</p>
              <p className="font-semibold text-[#1D1E41]">{birthPlace}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">Estado de nacimiento</p>
              <p className="font-semibold text-[#1D1E41]">{counrty}</p>
            </div>
            <div className='flex'>
              <p className="font-medium text-[#1D1E41] mr-2">Nacionalidad</p>
              <p className="font-semibold text-[#1D1E41]">{nationality}</p>
            </div>




            {/* Botón Editar */}
            <div className="mt-10 flex justify-start"> {/* Margen superior y alineado a la derecha */}
              <button
                // onClick={onEdit}
                className="bg-[#1D1E41] px-6 py-2 text-white text-lg font-semibold gap-4 transition-opacity flex items-center justify-center rounded-xl cursor-pointer"
              >
                <Image
                  src="/icons/Edit.png" 
                  alt="Editar perfil"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}