// screens/DashboardScreen.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
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

// 1. Registrasi plugin chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 2. DEFINISIKAN MAPPING MOOD (INI PENTING!)
const moodToValueMapping = {
  "senang": 6,
  "semangat": 5,
  "biasa": 4,
  "cemas": 3,
  "sedih": 2,
  "marah": 1,
};

const valueToMoodMapping = {
  6: "Senang",
  5: "Semangat",
  4: "Biasa",
  3: "Cemas",
  2: "Sedih",
  1: "Marah",
};

// Data dummy untuk Challenge & Badge (bisa Anda sesuaikan atau ganti dengan data dinamis nanti)
const completedChallenges = [
  { id: 'c1', title: 'Syukur Pagi Hari Ini' },
  { id: 'c2', title: 'Minum 2L Air Putih' },
];

const badges = [
  { id: 'b1', name: 'Pejuang Pagi' },
  { id: 'b2', name: 'Mood Master' },
];

function DashboardScreen() {
  const { currentUser, moodHistory, loadingMoods, loadingAuth } = useUser();

  // Filter mood entries untuk hari ini
  const today = new Date();
  const todayMoodEntries = moodHistory.filter(entry => {
    if (!entry || !entry.timestamp || typeof entry.timestamp.toDate !== 'function') {
      // Jika entry, timestamp, atau toDate tidak valid, lewati entri ini.
      // Anda bisa tambahkan console.warn di sini jika ingin melacak data yang tidak valid.
      // console.warn("Invalid mood entry found:", entry);
      return false;
    }
    const entryDate = entry.timestamp.toDate();
    return entryDate.getDate() === today.getDate() &&
           entryDate.getMonth() === today.getMonth() &&
           entryDate.getFullYear() === today.getFullYear();
  });

  // Kalkulasi Frekuensi Mood Harian
  const calculateDailyMoodFrequency = (entries) => {
    const frequency = {};
    entries.forEach(entry => {
      if (entry && entry.mood && typeof entry.mood === 'string') { // Pastikan entry.mood ada dan string
        frequency[entry.mood] = (frequency[entry.mood] || 0) + 1;
      }
    });
    return frequency;
  };

  const dailyMoodFrequency = calculateDailyMoodFrequency(todayMoodEntries);

  // Fungsi untuk mempersiapkan data chart
  const getChartData = () => {
    const dailyLatestMoods = {}; // Objek untuk menyimpan mood terakhir per hari
    // Proses moodHistory untuk mendapatkan data harian
    // Kita ambil mood terakhir yang diinput per hari untuk 7 hari unik terakhir
    [...moodHistory]
        .filter(entry => entry && entry.timestamp && typeof entry.timestamp.toDate === 'function' && entry.mood) // Filter data valid
        .sort((a,b) => a.timestamp.toDate() - b.timestamp.toDate()) // Urutkan berdasarkan waktu
        .forEach(entry => {
            const dateKey = entry.timestamp.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            // Ambil mood terakhir atau sesuaikan jika mau rata-rata
            dailyLatestMoods[dateKey] = moodToValueMapping[entry.mood] || 0;
        });

    const labels = Object.keys(dailyLatestMoods).slice(-7); // Ambil 7 hari terakhir
    const dataValues = labels.map(label => dailyLatestMoods[label]);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Mood Harian (Nilai Terakhir)',
          data: dataValues,
          fill: false,
          borderColor: 'rgb(20, 184, 166)',
          tension: 0.3,
        },
      ],
    };
  };
  const moodChartData = getChartData();


  // Tampilan Loading
  if (loadingAuth || loadingMoods) {
    return (
      <div className="container mx-auto text-center p-4 flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-300">Memuat data dashboard...</p>
      </div>
    );
  }

  // Jika tidak ada pengguna (seharusnya sudah ditangani Anonymous Auth, tapi sebagai fallback)
  if (!currentUser) {
    return (
      <div className="container mx-auto text-center p-4 flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-300">Pengguna tidak ditemukan. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Dashboard-ku</h1>

      {/* Bagian Mood Hari Ini */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
          Mood Hari Ini ({new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })})
        </h2>
        {todayMoodEntries.length > 0 ? (
          <div>
            {/* Tampilkan Frekuensi Mood */}
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-3">Ringkasan Mood:</h3>
            {dailyMoodFrequency && Object.keys(dailyMoodFrequency).length > 0 ? (
              <ul className="space-y-2 list-disc list-inside mb-6 pl-5">
                {Object.entries(dailyMoodFrequency).map(([mood, count]) => {
                  const moodDisplayName = typeof mood === 'string' ? (valueToMoodMapping[moodToValueMapping[mood]] || mood.charAt(0).toUpperCase() + mood.slice(1)) : "Data Mood Tidak Valid";
                  return (
                    <li key={mood} className="text-gray-700 dark:text-gray-300">
                      <span className={`font-semibold ${
                          mood === 'senang' ? 'text-green-500' :
                          mood === 'semangat' ? 'text-pink-500' :
                          mood === 'biasa' ? 'text-yellow-500' :
                          mood === 'sedih' ? 'text-blue-500' :
                          mood === 'cemas' ? 'text-orange-500' :
                          mood === 'marah' ? 'text-red-500' : 'text-gray-500' // Fallback color
                      }`}>
                        {moodDisplayName}
                      </span>
                      : {count} kali
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-6">Belum ada data ringkasan mood untuk ditampilkan.</p>
            )}


            <hr className="my-6 border-gray-200 dark:border-gray-700"/>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-3">Detail Entri:</h3>
            <ul className="space-y-3">
              {todayMoodEntries.map((entry) => {
                const moodDisplayName = (entry && entry.mood && typeof entry.mood === 'string') ? (valueToMoodMapping[moodToValueMapping[entry.mood]] || entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)) : "N/A";
                const entryTime = (entry && entry.timestamp && typeof entry.timestamp.toDate === 'function') ? entry.timestamp.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Waktu Tidak Valid';
                return (
                  <li key={entry.id} className="text-gray-700 dark:text-gray-300 flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                        entry.mood === 'senang' ? 'bg-green-400' :
                        entry.mood === 'semangat' ? 'bg-pink-400' :
                        entry.mood === 'biasa' ? 'bg-yellow-400' :
                        entry.mood === 'sedih' ? 'bg-blue-400' :
                        entry.mood === 'cemas' ? 'bg-orange-400' :
                        entry.mood === 'marah' ? 'bg-red-400' : 'bg-gray-400' // Fallback color
                    }`}></span>
                    <span className="font-medium">{moodDisplayName}</span>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">Pukul {entryTime}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Belum ada mood yang tercatat hari ini. Yuk, input mood-mu!</p>
        )}
      </div>

      {/* Bagian Chart, Challenge, Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grafik Mood */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Riwayat Emosi (7 Hari Terakhir)</h2>
          {moodChartData.labels && moodChartData.labels.length > 0 ? ( // Periksa apakah labels ada dan tidak kosong
            <Line data={moodChartData} options={{
              responsive: true,
              maintainAspectRatio: true, // Sesuaikan jika perlu
              scales: {
                y: {
                  ticks: {
                    callback: function(value) { return valueToMoodMapping[value] || ''; },
                    stepSize: 1,
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#4b5563', // Warna tick sumbu Y
                  },
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  min: 1, // Sesuaikan dengan nilai mood terendah Anda
                  max: 6  // Sesuaikan dengan nilai mood tertinggi Anda
                },
                x: {
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#4b5563', // Warna tick sumbu X
                  },
                  grid: {
                    display: false, // Sembunyikan grid sumbu X jika mau
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#374151', // Warna label legend
                  }
                }
              }
            }} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Data mood belum cukup untuk menampilkan grafik.</p>
          )}
        </div>

        {/* Challenge Selesai & Badge */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Challenge Selesai</h2>
            {completedChallenges.length > 0 ? (
              <ul className="space-y-2">
                {completedChallenges.map(ch => (
                  <li key={ch.id} className="text-gray-700 dark:text-gray-300">✅ {ch.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Belum ada challenge yang selesai.</p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Badge Terkumpul</h2>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {badges.map(b => (
                  <span key={b.id} className="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏅 {b.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Belum ada badge yang terkumpul.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;