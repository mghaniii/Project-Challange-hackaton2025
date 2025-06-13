// screens/SadariDiriPathScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; 
import { useUser } from '../context/UserContext';
import { edukasiLevels } from '../config/sadariDiriLevels';

function SadariDiriPathScreen() {
  // Kita tetap menggunakan sadariDiriProgress untuk melacak level yang sudah selesai
  const { sadariDiriProgress } = useUser();

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Jalur Sadari Diri: Anti-Judi</h1>
      
      <div className="space-y-4">
        {edukasiLevels.map((level, index) => {
          // Logika baru: hanya memeriksa apakah level sudah selesai atau belum
          const isCompleted = sadariDiriProgress >= parseInt(level.id, 10);

          return (
            <Link
              key={level.id}
              // Link sekarang selalu aktif, tidak ada lagi kondisi terkunci
              to={`/sadari-diri/${level.id}`}
              className={`block p-6 rounded-lg shadow-md transition-all duration-200 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border-l-4 ${
                isCompleted 
                  ? 'border-green-500' // Tanda hijau jika sudah selesai
                  : 'border-teal-500'   // Tanda teal jika tersedia
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    Level {index + 1}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {level.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Tipe: {level.type}
                  </p>
                </div>
                
                {isCompleted 
                  ? <CheckCircleIcon className="h-7 w-7 text-green-500 flex-shrink-0" /> 
                  : <ChevronRightIcon className="h-7 w-7 text-gray-400 flex-shrink-0" />
                }
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default SadariDiriPathScreen;
