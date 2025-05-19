// src/components/sidebar/BalanceActionsCard.tsx
"use client";

import React from 'react';
import { toast } from 'sonner';
import {
  LuArrowDownToLine,
  LuArrowUpFromLine,
  LuCopy,
} from 'react-icons/lu';
import Image from 'next/image';

interface BalanceActionsCardProps {
  balance?: string | null;        
  userAddress?: string | null;   
  onDeposit?: () => void;        
  onWithdraw?: () => void;        
}

export default function BalanceActionsCard({
  balance,
  userAddress,
  onDeposit,
  onWithdraw,
}: BalanceActionsCardProps) {
  
  // Copia la dirección al portapapeles
  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      toast.success("Dirección copiada al portapapeles"); 
    //   alert("Dirección copiada al portapapeles"); 
    }
  };

  return (
    <div className=" border-1 border-[#BBBBC6] text-[#1D1E41] px-6 py-8 rounded-xl mb-8 shadow flex flex-col items-center">
      <p className="text-md font-400  text-[#1D1E41] mb-1">Saldo disponible</p>
      <p className="text-2xl text-[#1D1E41] font-bold mb-2">
        {balance !== null && balance !== undefined ? `$ ${parseFloat(balance).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` : 'Cargando...'}
      </p>
      {userAddress && (
        <div className="flex items-center text-md font-400 text-[#1D1E41] mb-4">
          <span>{userAddress.substring(0, 8)}...{userAddress.substring(userAddress.length - 6)}</span>
          <button onClick={copyAddress} title="Copiar dirección" className="ml-2 ">
            <Image alt='Copiar dirección' src="/icons/Copiar.png" width={14} height={14} />
          </button>
        </div>
      )}
      <div className="space-y-3 w-full">
        <button 
          onClick={onDeposit}
          className="w-full flex items-center justify-center bg-[#1D1E41] text-white py-2 px-6 rounded-lg hover:bg-[#EE731B] transition-colors cursor-pointer"
          disabled={!userAddress}
        >
          <LuArrowDownToLine className="mr-2" /> Depositar
        </button>
        <button 
          onClick={onWithdraw}
          className="w-full flex items-center justify-center bg-[#1D1E41] text-white py-2 px-6 rounded-lg hover:bg-[#EE731B] transition-colors cursor-pointer"
          disabled={!userAddress}
        >
          <LuArrowUpFromLine className="mr-2" /> Retirar
        </button>
      </div>
    </div>
  );
}