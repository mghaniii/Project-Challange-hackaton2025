
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { edukasiLevels } from '../config/sadariDiriLevels';
import { useUser } from '../context/UserContext';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

function EdukasiLevelScreen() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { completeSadariDiriLevel, sadariDiriProgress } = useUser();

  const level = edukasiLevels.find(l => l.id === levelId);

  if (!level) {
    return <div className="p-6 text-center text-gray-800 dark:text-gray-100">Level tidak ditemukan.</div>;
  }
  
  const isCompleted = sadariDiriProgress >= parseInt(level.id, 10);

  const handleComplete = () => {
    completeSadariDiriLevel(levelId);
    navigate('/sadari-diri'); 
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            <button onClick={() => navigate('/sadari-diri')} className="flex items-center text-teal-600 dark:text-teal-400 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Jalur Edukasi
            </button>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 rounded-xl">
                <span className="text-sm font-bold uppercase text-teal-500">{level.type}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mt-1 mb-4">{level.title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{level.subtitle}</p>

                {/* --- PERBAIKAN DI SINI: MENGHAPUS 'prose' DAN MENAMBAH STYLING MANUAL --- */}
                <div className="space-y-4 text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                  {/* Pengecekan keamanan untuk memastikan konten adalah array */}
                  {Array.isArray(level.content) ? level.content.map((paragraph, index) => (
                    // Setiap elemen array akan menjadi paragraf baru
                    <p key={index}>{paragraph}</p>
                  )) : (
                    // Jika konten masih string biasa, tampilkan seperti biasa
                    <p>{level.content}</p>
                  )}
                </div>

                <div className="mt-12 text-center">
                    {isCompleted ? (
                        <div className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100">
                            <CheckCircleIcon className="h-6 w-6 mr-2" />
                            Sudah Selesai
                        </div>
                    ) : (
                        <button 
                            onClick={handleComplete}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                        >
                            Tandai Telah Dibaca & Selesai
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default EdukasiLevelScreen;
