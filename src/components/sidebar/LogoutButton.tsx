"use client";

import React from 'react';
import Image from 'next/image'; 

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="mt-auto pt-6">
      <button
        onClick={onLogout}
        className="flex items-center space-x-3 p-2.5 w-full rounded-lg text-gray-600 cursor-pointer transition-colors" // Tu clase original
      >
        <Image
          src="/icons/Logout.png"
          alt="Cerrar Sesión" 
          width={24}
          height={24}
        />
        <span className='text.md font-500 text-[#1D1E41]'>Cerrar sesión</span>
      </button>
    </div>
  );
}



    //   <div className="mt-auto pt-6">
    //     <button
    //       onClick={handleLogout}
    //       className="flex items-center space-x-3 p-2.5 w-full rounded-lg text-gray-600 cursor-pointer transition-colors"
    //     >
    //       {/* <LuLogOut size={20} className="text-gray-400 group-hover:text-red-500" /> Puse group-hover pero no hay grupo, ajusta si es necesario */}
    //       <Image
    //         src="/icons/Logout.png"
    //         alt="" 
    //         width={24} 
    //         height={24} 
    //       />
    //       <span className='text.md font-500 text-[#1D1E41]'>Cerrar sesión</span>
    //     </button>
    //   </div>