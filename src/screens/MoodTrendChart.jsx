import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moodToValueMapping = { "senang": 6, "semangat": 5, "biasa": 4, "cemas": 3, "sedih": 2, "marah": 1, "stres": 1 };
const valueToMoodMapping = { 6: "Senang", 5: "Semangat", 4: "Biasa", 3: "Cemas", 2: "Sedih", 1: "Marah/Stres", 0: "" };

function MoodTrendChart({ moodHistory }) {

  const moodChartData = useMemo(() => {
    if (!moodHistory || moodHistory.length === 0) {
      return { labels: [], datasets: [] };
    }
    const chartData = {};
    const sortedForChart = [...moodHistory].sort((a,b) => a.timestamp.toDate() - b.timestamp.toDate());
    sortedForChart.forEach(entry => {
      if (!entry?.mood || !entry?.timestamp?.toDate) return;
      const dateKey = entry.timestamp.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      chartData[dateKey] = moodToValueMapping[entry.mood.toLowerCase()] || 0;
    });
    const labels = Object.keys(chartData);
    const dataValues = labels.map(label => chartData[label]);
    return {
      labels,
      datasets: [{
          label: 'Tren Mood',
          data: dataValues,
          fill: false,
          borderColor: 'rgb(20, 184, 166)',
          tension: 0.3,
          pointBackgroundColor: 'rgb(20, 184, 166)',
          pointHoverRadius: 7,
      }],
    };
  }, [moodHistory]);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function(value) { return valueToMoodMapping[value] || ''; },
          stepSize: 1,
          color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#94a3b8' : '#4b5563',
        },
        grid: { color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', },
        // --- PERUBAHAN 1: Memberi ruang napas pada sumbu Y ---
        min: 0,
        max: 7
      },
      x: {
        ticks: { color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#94a3b8' : '#4b5563', },
        grid: { display: false, }
      }
    },
    plugins: {
      legend: { labels: { color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#374151', } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) {
              label += valueToMoodMapping[context.parsed.y] || 'Tidak Diketahui';
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Grafik Tren Mood</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">"Kendalikan Mood anda bukan Mood yang mengendalikan anda"</p>
      
      {moodChartData.labels.length > 0 ? (
        // --- PERUBAHAN 2: Menambah tinggi kontainer grafik ---
        <div className="h-96 relative">
          <Line 
            data={moodChartData} 
            options={chartOptions} 
          />
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Data tidak cukup untuk menampilkan grafik.</p>
        </div>
      )}
    </div>
  );
}

export default MoodTrendChart;