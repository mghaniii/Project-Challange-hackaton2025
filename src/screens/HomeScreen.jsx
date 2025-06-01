// src/screens/HomeScreen.jsx
import React from 'react'; // useState mungkin tidak lagi dibutuhkan sebanyak sebelumnya untuk nama
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Tetap gunakan ini

// moods array tetap sama
const moods = [
  { name: "Senang", emoji: "😊", color: "bg-green-400 hover:bg-green-500 ", value: "senang" },
  { name: "Biasa", emoji: "😐", color: "bg-yellow-400 hover:bg-yellow-500", value: "biasa" },
  { name: "Sedih", emoji: "😢", color: "bg-blue-400 hover:bg-blue-500", value: "sedih" },
  { name: "Cemas", emoji: "😟", color: "bg-orange-400 hover:bg-orange-500", value: "cemas" },
  { name: "Semangat", emoji: "🤩", color: "bg-pink-400 hover:bg-pink-500", value: "semangat"},
  { name: "Marah", emoji: "😠", color: "bg-red-400 hover:bg-red-500", value: "marah"},
];

function HomeScreen() {
  const navigate = useNavigate();
  // ✅ Ambil currentUser, loadingAuth, dan addMoodEntry dari context
  // Fungsi lama seperti userName, saveUserName, clearUserName, skipNameInput
  // mungkin tidak lagi digunakan atau perlu logika baru jika ingin menyimpan nama ke Firebase.
  const { currentUser, loadingAuth, addMoodEntry } = useUser();

  const handleMoodSelect = (moodValue) => {
    if (!currentUser) {
      alert("Harap tunggu, sedang menghubungkan ke server..."); // Atau UI yang lebih baik
      return;
    }
    addMoodEntry(moodValue); // Ini akan memanggil addMoodEntry yang menyimpan ke Firestore
    navigate(`/chat?mood=${moodValue}`); // Navigasi ini bisa tetap jika masih relevan
  };

  // Menampilkan loading jika proses autentikasi awal belum selesai
  if (loadingAuth) {
    return (
      <div className="container mx-auto text-center p-4">
        <p className="text-xl text-gray-600 dark:text-gray-300">Memuat...</p>
      </div>
    );
  }

  // Sapaan bisa disederhanakan untuk pengguna anonim
  // Jika Anda ingin fitur nama, itu perlu disimpan di profil user Firebase atau collection terpisah
  const greetingName = currentUser ? "" : "Tamu"; // Atau "Halo!" saja

  return (
    <div className="container mx-auto text-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Hallo {greetingName}! 👋
        </h1>
        {/* Jika ingin ada cara ganti nama/login, tombolnya bisa diletakkan di sini nanti */}
      </div>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
        Lagi ngerasa apa hari ini?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`p-4 md:p-6 rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-white ${mood.color} flex flex-col items-center justify-center aspect-square`}
            disabled={!currentUser || loadingAuth} // ✅ Nonaktifkan tombol jika belum siap
          >
            <span className="text-4xl md:text-5xl block mb-2">{mood.emoji}</span>
            <span className="text-base md:text-lg font-semibold">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;