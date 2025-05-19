// app/page.tsx (o src/app/page.tsx si usas src)
// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center text-center bg-slate-100 p-6">

//       <div className="bg-white p-10 rounded-xl shadow-xl"> 
//         <h1 className='text-4xl font-bold text-gray-800 mb-8'> 
//           Bienvenido a la Prueba Técnica de Metlabs
//         </h1>
//         <Link 
//           href="/login" 
//           className="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150"
//         >
//           Ir a Login/Registro
//         </Link>
//       </div>
//     </div>
//   );
// }

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
  // No se renderizará nada aquí porque la redirección ocurre en el servidor.
  //Por buena práctica, se podría retornar null o un loader simple si fuera necesario.
  return null; 
}