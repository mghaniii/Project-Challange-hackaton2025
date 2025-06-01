// screens/DailyChallengeScreen.js
// screens/DailyChallengeScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext'; // Pastikan path ini benar
import { db } from '../firebase'; // Pastikan path ini benar
import { doc, setDoc, getDocs, collection, query, serverTimestamp } from "firebase/firestore";

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';



const masterChallengesList= [
  {
    id: "1",
    title: "Syukur Pagi",
    description: "Tulis 3 hal yang kamu syukuri hari ini.",
    completed: false,
    imageUrl: "https://images.unsplash.com/photo-1549032305-e816fabf0dd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGhhbmt8ZW58MHx8MHx8fDA%3D" // Contoh gambar yang lebih relevan
  },
  {
    id: "2",
    title: "Minum Air",
    description: "Minum 8 gelas air putih hari ini.",
    completed: true,
    imageUrl: "https://plus.unsplash.com/premium_photo-1661397109296-577ffccaf0ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "3",
    title: "Meditasi atau Ibadah Singkat 5 Menit",
    description: "Luangkan 5 menit untuk duduk tenang, fokus pada napas atau beribadah.",
    completed: false,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "4",
    title: "Jurnal Perasaan",
    description: "Tuliskan perasaan yang paling dominan kamu rasakan hari ini dan pemicunya.",
    completed: false,
    // Ganti imgUrl menjadi imageUrl agar konsisten
    imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8am91cm5hbGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "5",
    title: "Bergerak Aktif 20 Menit",
    description: "Lakukan aktivitas fisik ringan selama 20 menit (jalan kaki, peregangan).",
    completed: false,
    imageUrl: "https://images.unsplash.com/photo-1485727749696-0943e749d0de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXhlcmNpc2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "6",
    title: "Hubungi Seorang Teman",
    description: "Kirim pesan atau telepon seorang teman yang sudah lama tidak kamu sapa.",
    completed: false,
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJpZW5kcyUyMGNvbm5lY3Rpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "7",
    title: "Teknik Relaksasi Pernapasan",
    description: "Lakukan teknik pernapasan kotak selama beberapa menit.",
    completed: false,
    imageUrl: "https://plus.unsplash.com/premium_photo-1724478438899-65aa459d178a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVrbmlrJTIwcmVsYWtzYXNpJTIwcGVybmFmYXNhbnxlbnwwfHwwfHx8MA%3D%3D"
  },

];



function DailyChallengeScreen() {
  const { currentUser, loadingAuth } = useUser();
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayDateString = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  const fetchChallengeStatuses = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      // Jika tidak ada user, tampilkan challenge default tanpa status dari DB
      setDailyChallenges(masterChallengesList.map(ch => ({ ...ch, completed: false })));
      return;
    }

    setIsLoading(true);
    const statuses = {};
    const userChallengeStatusCollectionPath = `users/${currentUser.uid}/challengeStatuses/${todayDateString}/challenges`;

    try {
      const q = query(collection(db, userChallengeStatusCollectionPath));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        statuses[doc.id] = doc.data().completed;
      });

      const updatedChallenges = masterChallengesList.map(challenge => ({
        ...challenge,
        completed: statuses[challenge.id] || false,
      }));
      setDailyChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error fetching challenge statuses: ", error);
      // Jika error, tampilkan challenge dengan status default
      setDailyChallenges(masterChallengesList.map(ch => ({ ...ch, completed: false })));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, todayDateString]);

  useEffect(() => {
    if (!loadingAuth) { // Hanya fetch jika proses auth Firebase selesai
      fetchChallengeStatuses();
    }
  }, [currentUser, loadingAuth, fetchChallengeStatuses]); // Tambahkan fetchChallengeStatuses ke dependency

  const handleToggleCompleteChallenge = async (challengeId, currentStatus) => {
    if (!currentUser) {
      console.error("User not authenticated to complete challenge.");
      return;
    }

    const newCompletedStatus = !currentStatus;

    // Update local state immediately for better UX
    setDailyChallenges(prevChallenges =>
      prevChallenges.map(ch =>
        ch.id === challengeId ? { ...ch, completed: newCompletedStatus } : ch
      )
    );

    // Update Firestore
    const challengeToUpdate = masterChallengesList.find(c => c.id === challengeId);
    if (!challengeToUpdate) {
        console.error("Challenge definition not found in master list for ID:", challengeId);
        return;
    }

    const challengeStatusDocRef = doc(db, `users/${currentUser.uid}/challengeStatuses/${todayDateString}/challenges`, challengeId);
    try {
      await setDoc(challengeStatusDocRef, {
        completed: newCompletedStatus,
        title: challengeToUpdate.title, // Simpan title untuk referensi
        lastUpdated: serverTimestamp()
      }, { merge: true }); // Gunakan merge true untuk update atau create
      console.log(`Challenge ${challengeId} status updated to ${newCompletedStatus} in Firestore.`);
    } catch (error) {
      console.error(`Error updating challenge ${challengeId} status in Firestore: `, error);
      // Rollback local state if Firestore update fails
      setDailyChallenges(prevChallenges =>
        prevChallenges.map(ch =>
          ch.id === challengeId ? { ...ch, completed: currentStatus } : ch // Kembalikan ke status awal
        )
      );
      alert("Gagal memperbarui status challenge. Coba lagi.");
    }
  };

  if (loadingAuth || isLoading) {
    return (
      <div className="container mx-auto p-6 text-center flex justify-center items-center min-h-[calc(100vh-100px)]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Memuat challenge harian...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        Tantangan Harian Untukmu ✨
      </h1>
      {dailyChallenges.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Tidak ada challenge tersedia saat ini.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {dailyChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
              challenge.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-teal-500'
            }`}
          >
            <div className="flex-grow"> {/* Konten atas akan mengisi ruang yang tersedia */}
              {challenge.imageUrl && (
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 truncate" title={challenge.title}>
                  {challenge.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[4.5rem] overflow-y-auto custom-scrollbar">
                  {/* min-h-[calc(3*1.5rem)] untuk sekitar 3 baris teks, sesuaikan */}
                  {challenge.description}
                </p>
              </div>
            </div>

            {/* Tombol selalu di bawah */}
            <div className="p-5 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => handleToggleCompleteChallenge(challenge.id, challenge.completed)}
                className={`w-full px-4 py-2.5 text-sm font-medium text-white rounded-md transition-colors flex items-center justify-center ${
                  challenge.completed
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {challenge.completed ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" /> Selesai!
                  </>
                ) : 'Tandai Selesai'}
              </button>
              {/* Tombol Lewati bisa ditambahkan di sini jika perlu */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DailyChallengeScreen;