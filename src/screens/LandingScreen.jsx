
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Selamat Datang di Kuat Diri
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
        Sebuah ruang aman untuk memahami perasaan, memantau perkembangan, dan berbincang dengan AI yang peduli.
      </p>
      <button
        onClick={() => navigate('/home')} 
        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
      >
        Mulai Sekarang
      </button>
      <p className="text-xs text-gray-500 mt-1 max-w-md">
       Anda masuk sebagai Anonymous
      </p>  

      <p className="text-xs text-gray-500 mt-12 max">
        Penting: Aplikasi ini adalah alat bantu dan bukan pengganti layanan kesehatan mental profesional.
      </p>
      <p className="text-xs text-gray-500 mt-1 max">
        Catatan: Tolong dukung aplikasi ini agar nanti developer menyediakan fitur yang yang lebih banyak dan bermanfaat.
      </p>
    </div>
  );
}
export default LandingScreen;