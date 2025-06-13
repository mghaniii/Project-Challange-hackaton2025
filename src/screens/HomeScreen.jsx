

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import { toast } from 'react-hot-toast'; // Impor toast untuk notifikasi

// Array untuk data mood
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
 const { currentUser, loadingAuth, addMoodEntry } = useUser();

  // Fungsi yang akan dipanggil saat tombol mood diklik
 const handleMoodSelect = async (moodValue, moodName) => {
 // Cek jika user belum siap (masih loading atau belum login)
 if (!currentUser || loadingAuth) {
 toast.error("Gagal terhubung ke server. Coba lagi sesaat.");
return;
 }

    // Tampilkan notifikasi loading saat proses penyimpanan dimulai
 const toastId = toast.loading('Menyimpan mood...'); 

 try {
      // Gunakan 'await' untuk menunggu fungsi addMoodEntry selesai
 await addMoodEntry(moodValue); 

      // Jika berhasil, update notifikasi menjadi pesan sukses
 toast.success(`Mood ${moodName} kamu berhasil disimpan!`, { id: toastId });

 } catch (error) {
 console.error("Gagal menyimpan mood:", error);
      // Jika gagal, update notifikasi menjadi pesan error
 toast.error("Gagal menyimpan mood.", { id: toastId });
 }
 // Baris untuk pindah halaman sudah dihapus
 // navigate(`/chat?mood=${moodValue}`); 
 };

 // Menampilkan pesan "Memuat..." jika autentikasi belum selesai
 if (loadingAuth) {
 return (
 <div className="container mx-auto text-center p-4">
 <p className="text-xl text-gray-600 dark:text-gray-300">Memuat...</p>
 </div>
 );
}

  // Logika untuk sapaan pengguna
 const greetingName = currentUser ? "" : "Tamu"; 

 return (
<div className="container mx-auto text-center p-4">
<div className="mb-8">
 <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
       Hallo {greetingName}! 👋
 </h1>
 </div>
<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
 Lagi ngerasa apa hari ini?
 </p>
 <p className="text-sm text-gray-600 dark:text-gray-300 mb-10">
  Mood kamu akan tercatat ke dashboard untuk memantau perkembanganmu!!
</p>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
 {moods.map((mood) => (
 <button
 key={mood.value}
            // Kirim juga mood.name untuk ditampilkan di notifikasi toast
 onClick={() => handleMoodSelect(mood.value, mood.name)} 
 className={`p-4 md:p-6 rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-white ${mood.color} flex flex-col items-center justify-center aspect-square`}
 disabled={!currentUser || loadingAuth} // Nonaktifkan tombol jika belum siap
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