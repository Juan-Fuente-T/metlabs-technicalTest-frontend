// src/components/Footer.tsx
import Link from 'next/link';
import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300 pt-12 pb-8 px-4 md:px-8"> 
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Columna del LOGO y Síguenos */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-white mb-4">LOGO</h2>
            <h3 className="text-lg font-semibold text-white mb-3">Síguenos</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={24} />
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF size={24} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <FaXTwitter size={24} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn size={24} />
              </a>
            </div>
            <p className="text-xs text-gray-500">&copy; 2025. All rights reserved.</p>
          </div>

          {/* Columna Categorías */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Categorías</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Inmobiliaria</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Agrícola</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Solar</Link></li>
            </ul>
          </div>

          {/* Columna Ayuda */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Quiénes somos</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Soporte</Link></li>
            </ul>
          </div>

          {/* Columna Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}