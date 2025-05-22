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

// Registrasi plugin chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Data mood dummy
const moodData = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
  datasets: [
    {
      label: 'Mood Harian',
      data: [3, 4, 2, 5, 4, 3, 4],
      fill: false,
      borderColor: 'rgb(20, 184, 166)', // Warna teal
      tension: 0.3,
    },
  ],
};

// ✅ Data challenge selesai
const completedChallenges = [
  { id: 'c1', title: 'Syukur Pagi' },
  { id: 'c2', title: 'Minum Air Putih' },
  { id: 'c3', title: 'Tidur 7 Jam' },
];

// ✅ Data badge
const badges = [
  { id: 'b1', name: 'Mood Stabil' },
  { id: 'b2', name: 'Penyemangat Hari Ini' },
  { id: 'b3', name: 'Pemenang Challenge' },
];

function DashboardScreen() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard-ku</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Mood */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Riwayat Emosi Mingguan</h2>
          <Line data={moodData} />
        </div>

        {/* Challenge Selesai & Badge */}
        <div className="space-y-6">
          {/* Challenge */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Challenge Selesai</h2>
            {completedChallenges.length > 0 ? (
              <ul className="space-y-2">
                {completedChallenges.map(ch => (
                  <li key={ch.id} className="text-gray-600">✅ {ch.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Belum ada challenge selesai.</p>
            )}
          </div>

          {/* Badge */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Badge Terkumpul</h2>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {badges.map(b => (
                  <span key={b.id} className="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏅 {b.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada badge terkumpul.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
