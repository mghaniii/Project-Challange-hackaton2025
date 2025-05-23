


// screens/HomeScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Impor ikon jika diperlukan, misal dari Heroicons atau custom SVG
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

const moods = [
  { name: "Senang", emoji: "😊", color: "bg-green-400 hover:bg-green-500" },
  { name: "Biasa", emoji: "😐", color: "bg-yellow-400 hover:bg-yellow-500" },
  { name: "Sedih", emoji: "😢", color: "bg-blue-400 hover:bg-blue-500" },
  { name: "Cemas", emoji: "😟", color: "bg-orange-400 hover:bg-orange-500" },
  // Tambahkan mood lain
];





function HomeScreen() {
   const navigate = useNavigate();
  // const [userName, setUserName] = useState("User"); // Ambil dari auth jika ada

  const handleMoodSelect = (moodName) => {
    // Simpan mood di state atau context jika perlu
    navigate(`/chat?mood=${moodName}`); // Navigasi ke chat dengan parameter mood
  };

  return (
    // Container utama mungkin sudah di-handle oleh MainLayout,
    // tapi jika ada background spesifik di sini, tambahkan dark mode
    <div className="container mx-auto text-center p-4 ">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Halo User!
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
        Lagi ngerasa apa hari ini?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood.name)}
            // Warna tombol mood mungkin perlu penyesuaian agar kontras di dark mode
            // Contoh: jika warna terang, teksnya mungkin perlu lebih gelap di light mode
            // dan lebih terang di dark mode jika warna button juga berubah.
            // Untuk sementara, kita biarkan warna button tetap sama, tapi teksnya mungkin perlu di-override.
            className={`p-6 rounded-lg shadow-lg text-white dark:text-gray-100 transition-transform transform hover:scale-105 ${mood.color} dark:opacity-90 dark:hover:opacity-100`}
          >
            <span className="text-5xl md:text-6xl block mb-2">{mood.emoji}</span>
            <span className="text-lg font-semibold">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;
