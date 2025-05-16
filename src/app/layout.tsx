import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metlabs App Technical Test",
  description: "Juan Fuente - Metlabs App Technical Test Developed with Next.js",
};


  
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log("Google Client ID:", googleClientId);

  if (!googleClientId) {
      console.warn("ADVERTENCIA: Google Client ID no está configurado. El login con Google no funcionará.");
  }
  return (
    <html lang="es-ES" className="h-full"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow container mx-auto p-4 mt-4">
                {children}
              </main>
              <Footer />
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </GoogleOAuthProvider>
        ) : (
          // Si NO hay googleClientId, renderiza la app sin GoogleOAuthProvider.
          // El login con Google simplemente no estará disponible.
          <AuthProvider>
            <Navbar />
            <main className="flex-grow container mx-auto p-4 mt-4">
              {children}
              {/* Mensaje opcional para el desarrollador visible en la UI si falta el ID */}
              <div style={{ 
                padding: '1rem', 
                margin: '1rem 0', 
                backgroundColor: '#fff3cd', 
                color: '#856404', 
                border: '1px solid #ffeeba', 
                textAlign: 'center' 
              }}>
                (Modo Desarrollo: Login con Google deshabilitado - GOOGLE_CLIENT_ID no configurado en .env.local)
              </div>
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}