import React, { useState, useMemo } from 'react';
import MoodTrendChart from '../screens/MoodTrendChart';
import { badgeList } from '../config/badges'; 
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useUser } from '../context/UserContext';



// Registrasi plugin chart.js
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

// Definisi mapping mood
const moodToValueMapping = {
  "senang": 6, "semangat": 5, "biasa": 4, "cemas": 3, "sedih": 2, "marah": 1, "stres": 1,
};

const valueToMoodMapping = {
  6: "Senang", 5: "Semangat", 4: "Biasa", 3: "Cemas", 2: "Sedih", 1: "Marah/Stres",
};


// --- Komponen Utama Dashboard ---

function DashboardScreen() {
  const { currentUser, userBadges, loadingMoods, loadingAuth, moodHistory } = useUser();
  
  // State untuk buka-tutup panduan badge
  const [showGuide, setShowGuide] = useState(false);
  // --- STATE BARU UNTUK BUKA-TUTUP RIWAYAT MOOD ---
  const [showMoodHistory, setShowMoodHistory] = useState(false);


  // Fungsi untuk mendapatkan rentang tanggal default (7 hari terakhir)
  const getInitialDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6); // 7 hari termasuk hari ini
    return { start, end };
  };

  // State untuk rentang tanggal dan status tampilan
  const [startDate, setStartDate] = useState(getInitialDateRange().start);
  const [endDate, setEndDate] = useState(getInitialDateRange().end);

  // Filter moodHistory berdasarkan rentang tanggal, dioptimalkan dengan useMemo
  const filteredMoodHistory = useMemo(() => {
    if (!moodHistory || !startDate || !endDate) return [];

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    return moodHistory
      .filter(entry => {
        if (!entry?.timestamp?.toDate) return false;
        const entryDate = entry.timestamp.toDate();
        return entryDate >= startOfDay && entryDate <= endOfDay;
      })
      .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  }, [moodHistory, startDate, endDate]); 

  // Kelompokkan riwayat mood per hari untuk tampilan ringkas
  const groupedMoodHistory = useMemo(() => {
    const groups = {};
    filteredMoodHistory.forEach(entry => {
      if (!entry?.timestamp?.toDate) return;
      const dateKey = entry.timestamp.toDate().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return groups;
  }, [filteredMoodHistory]);

  const handleDateChange = (e) => {
    const { name, valueAsDate } = e.target;
    if (name === "startDate") {
      setStartDate(valueAsDate ? new Date(valueAsDate) : getInitialDateRange().start);
    } else if (name === "endDate") {
      setEndDate(valueAsDate ? new Date(valueAsDate) : getInitialDateRange().end);
    }
  };
  
  const resetDateRange = () => {
    const { start, end } = getInitialDateRange();
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  };

  if (loadingAuth || loadingMoods) {
    return <div className="text-center p-6">Memuat data dashboard...</div>;
  }
  
  if (!currentUser) {
    return <div className="text-center p-6">Pengguna tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Dashboard-ku</h1>

      {/* Pemilih Rentang Tanggal */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Pilih Rentang Waktu</h2>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dari Tanggal</label>
            <input type="date" id="startDate" name="startDate" value={startDate.toISOString().split('T')[0]} onChange={handleDateChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-gray-200"/>
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Sampai Tanggal</label>
            <input type="date" id="endDate" name="endDate" value={endDate.toISOString().split('T')[0]} onChange={handleDateChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-gray-200"/>
          </div>
          <div>
            {/* <button onClick={resetDateRange} className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
              Reset (7 Hari)
            </button> */}
          </div>
        </div>
      </div>
      
      {/* --- BAGIAN RIWAYAT MOOD YANG DIPERBARUI --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
        <button 
          onClick={() => setShowMoodHistory(!showMoodHistory)}
          className="w-full flex justify-between items-center text-left text-2xl font-semibold text-gray-700 dark:text-gray-200"
        >
          <span>Riwayat Mood Tercatat</span>
          {showMoodHistory ? <ChevronUpIcon className="h-6 w-6"/> : <ChevronDownIcon className="h-6 w-6"/>}
        </button>

        {/* Daftar riwayat mood hanya akan ditampilkan jika showMoodHistory bernilai true */}
        {showMoodHistory && (
            <div className="mt-6">
                {Object.keys(groupedMoodHistory).length > 0 ? (
                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                    {Object.entries(groupedMoodHistory).map(([date, entries]) => (
                    <div key={date}>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 pb-2 mb-3 border-b border-gray-200 dark:border-slate-700">{date}</h3>
                        <div className="flex flex-wrap gap-2">
                        {entries.map(entry => {
                            if (!entry?.id || !entry?.mood) return null;
                            const moodKey = entry.mood.toLowerCase();
                            const moodValueFromMap = moodToValueMapping[moodKey];
                            const moodDisplayName = valueToMoodMapping[moodValueFromMap] || entry.mood;
                            const entryTime = entry.timestamp.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                            return (
                            <div key={entry.id} title={`Mood ${moodDisplayName} pada pukul ${entryTime}`} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-transform transform hover:scale-105 ${
                                moodKey === 'senang' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                moodKey === 'semangat' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                                moodKey === 'biasa' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                moodKey === 'sedih' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                moodKey === 'cemas' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                moodKey === 'marah' || moodKey === 'stres' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                                <span>{moodDisplayName}</span>
                                <span className="opacity-75 font-normal">{entryTime}</span>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="mt-4 text-gray-500 dark:text-gray-400">Tidak ada mood yang tercatat pada rentang waktu ini.</p>
                )}
            </div>
        )}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grafik sekarang menggunakan data yang sudah difilter */}
        <MoodTrendChart moodHistory={filteredMoodHistory} />

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Badge Terkumpul</h2>
            
            {userBadges && Object.keys(userBadges).length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {Object.keys(userBadges).map(badgeId => {
                  const badgeInfo = badgeList[badgeId];
                  if (!badgeInfo) return null;
                  return (
                    <div key={badgeId} className="text-center group w-24 flex flex-col items-center" title={`${badgeInfo.name}: ${badgeInfo.description}`}>
                      <img src={badgeInfo.imageUrl || 'https://via.placeholder.com/64'} alt={badgeInfo.name} className="h-16 w-16 mx-auto"/>
                      <p className="text-xs mt-2 text-gray-600 dark:text-gray-300 font-medium text-wrap">{badgeInfo.name}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Belum ada badge yang terkumpul.</p>
            )}
            
            {/* Bagian Panduan Badge yang Ringan */}
            <div className="mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
              <button 
                onClick={() => setShowGuide(!showGuide)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-700 dark:text-gray-300"
              >
                <span>Panduan Mendapatkan Badge</span>
                {showGuide ? <ChevronUpIcon className="h-6 w-6"/> : <ChevronDownIcon className="h-6 w-6"/>}
              </button>

              {showGuide && (
                <div className="mt-4 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {Object.values(badgeList).map((badge) => (
                    <div key={badge.name} className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <img src={badge.imageUrl} alt={badge.name} className="h-14 w-14 flex-shrink-0"/>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{badge.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
