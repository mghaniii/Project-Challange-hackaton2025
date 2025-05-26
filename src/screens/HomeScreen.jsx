// src/screens/HomeScreen.jsx
import React, { useState } from 'react'; // useEffect tidak lagi dibutuhkan di sini untuk load nama
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// ... (definisi moods array tetap sama)
const moods = [
  { name: "Senang", emoji: "😊", color: "bg-green-400 hover:bg-green-500", value: "senang" },
  { name: "Biasa", emoji: "😐", color: "bg-yellow-400 hover:bg-yellow-500", value: "biasa" },
  { name: "Sedih", emoji: "😢", color: "bg-blue-400 hover:bg-blue-500", value: "sedih" },
  { name: "Cemas", emoji: "😟", color: "bg-orange-400 hover:bg-orange-500", value: "cemas" },
  { name: "Semangat", emoji: "🤩", color: "bg-pink-400 hover:bg-pink-500", value: "semangat"},
  { name: "Marah", emoji: "😠", color: "bg-red-400 hover:bg-red-500", value: "marah"},
];

function HomeScreen() {
  const navigate = useNavigate();
  const { userName, saveUserName, clearUserName, skipNameInput } = useUser();
  const [inputName, setInputName] = useState('');

  const handleNameSubmit = (e) => {
    e.preventDefault();
    saveUserName(inputName); // Fungsi saveUserName di context sudah menangani string kosong
    setInputName('');
  };

  const handleSkipName = () => {
    skipNameInput(); // Panggil fungsi skip dari context
  };

  const handleMoodSelect = (moodValue) => {
    // Pengguna bisa lanjut memilih mood meskipun nama tidak diisi
    localStorage.setItem('currentMood', moodValue);
    navigate(`/chat?mood=${moodValue}`);
  };

  const handleChangeName = () => {
    clearUserName(); // Ini akan membuat userName di context jadi null, sehingga form input muncul lagi
  }

  // Kondisi untuk menampilkan form input nama: userName === null
  // Ini berarti aplikasi baru dimuat dan belum ada keputusan (isi/skip) ATAU nama telah di-clear.
  if (userName === null) {
    return (
      <div className="container mx-auto text-center p-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Selamat Datang! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Kami ingin menyapamu lebih personal. Kamu bisa memasukkan nama panggilanmu di bawah, atau lewati jika tidak ingin.
          </p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="nameInput" className="sr-only">Masukkan nama Anda</label>
              <input
                id="nameInput"
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Nama panggilanmu (opsional)..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none dark:bg-slate-700 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Simpan Nama
            </button>
            <button
              type="button" // Penting: type="button" agar tidak submit form
              onClick={handleSkipName}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Lewati
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tampilan sapaan dan mood tracker
  // Sapaan disesuaikan berdasarkan apakah userName punya isi atau string kosong (skip)
  const greetingName = userName && userName.trim() !== "" ? userName : "User";

  return (
    <div className="container mx-auto text-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Halo {greetingName}! 👋
        </h1>
        {/* Tombol ganti nama hanya muncul jika nama pernah diisi atau di-skip.
            Jika userName null (prompt awal), tombol ini tidak muncul. */}
        {userName !== null && (
            <button
            onClick={handleChangeName}
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-1"
            >
            (Ganti nama / Isi nama)
            </button>
        )}
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