// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#1D1E41] text-white py-12 px-4 md:px-8 lg:px-20"> 
      <div className="mx-auto max-w-[1280px]">
        
        {/* Sección del LOGO */}
        <div className="mb-8 lg:mb-10"> {/* Espacio debajo del logo */}
          <Image src="/LOGO.png" alt="Logo" width={143} height={38} />
        </div>

        {/* Sección de las Columnas de Links y Redes Sociales */}
        {/* Para móvil (grid-cols-1), para tablet (md:grid-cols-2), para desktop (lg:grid-cols-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Columna Síguenos y Copyright  */}
          <div className="flex flex-col justify-between order-4 lg:order-1">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3> {/* Figma usa mb-4 para títulos aquí */}
              <div className="flex space-x-4 mb-6"> {/* Espacio entre iconos y debajo de ellos */}
                <a href="#" aria-label="YouTube" className="text-white hover:text-white transition-colors"><FaYoutube size={24} /></a>
                <a href="#" aria-label="Facebook" className="text-white hover:text-white transition-colors"><FaFacebookF size={24} /></a>
                <a href="#" aria-label="Twitter" className="text-white hover:text-white transition-colors"><FaXTwitter size={24} /></a>
                <a href="#" aria-label="Instagram" className="text-white hover:text-white transition-colors"><FaInstagram size={24} /></a>
                <a href="#" aria-label="LinkedIn" className="text-white hover:text-white transition-colors"><FaLinkedinIn size={24} /></a>
              </div>
            </div>
            <p className="text-sm text-white font-400">&copy; 2025. All rights reserved.</p>
          </div>

          {/* Columna Categorías */}
          <div className='order-1 lg:order-2'>
            <h3 className="text-lg font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Inmobiliaria</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Agrícola</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Solar</Link></li>
            </ul>
          </div>

          {/* Columna Ayuda */}
          <div className='order-2 lg:order-3'>
            <h3 className="text-lg font-semibold text-white mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Quiénes somos</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Soporte</Link></li>
            </ul>
          </div>

          {/* Columna  Legal */}
          <div className='order-3 lg:order-4'>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors text-sm">Política de Cookies</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}