import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { db } from '../firebase';
import { doc, setDoc, getDocs, collection, query, serverTimestamp, deleteDoc } from "firebase/firestore";
import toast from 'react-hot-toast';
import { masterChallengesList } from '../config/masterChallengesList';
import { XCircleIcon } from '@heroicons/react/24/solid'; 

// Helper untuk memberikan warna pada setiap kategori
const categoryColors = {
  "Kesadaran diri": "bg-teal-100 text-teal-800",
  "Self-Care": "bg-purple-100 text-purple-800",
  "Sosial": "bg-sky-100 text-sky-800",
  "Refleksi-diri": "bg-yellow-100 text-yellow-800",
  "Kreatifitas": "bg-rose-100 text-rose-800",
  "Kesehatan Keuangan": "bg-slate-100 text-slate-800",
  "Kesejahteraan Digital": "bg-indigo-100 text-indigo-800",
  "Grounding": "bg-green-100 text-green-800",
  "Growth-Mindset": "bg-blue-100 text-blue-800",
  "Kebaikan": "bg-pink-100 text-pink-800",
  "Self-Awareness": "bg-amber-100 text-amber-800",
  "Self-Love": "bg-pink-100 text-pink-800",
  "Default": "bg-gray-100 text-gray-800",
};

const getCategoryClass = (category) => {
    return categoryColors[category] || categoryColors.Default;
}

function DailyChallengeScreen() {
  const { currentUser, loadingAuth } = useUser();
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null);

  const todayDateString = new Date().toISOString().split('T')[0];

  const fetchChallengeStatuses = useCallback(async (user) => {
    setIsLoading(true);
    const statuses = {};
    const userChallengeStatusCollectionPath = `users/${user.uid}/challengeStatuses/${todayDateString}/challenges`;
    try {
      const q = query(collection(db, userChallengeStatusCollectionPath));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        statuses[doc.id] = doc.data().completed;
      });
      const updatedChallenges = masterChallengesList.map(challenge => ({ ...challenge, completed: statuses[challenge.id] || false }));
      setDailyChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error fetching challenge statuses: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [todayDateString, currentUser]);

  useEffect(() => {
    if (!loadingAuth && currentUser) {
      fetchChallengeStatuses(currentUser);
    } else if (!loadingAuth && !currentUser) {
      setIsLoading(false);
      setDailyChallenges(masterChallengesList.map(ch => ({ ...ch, completed: false })));
    }
  }, [currentUser, loadingAuth, fetchChallengeStatuses]);


  // --- FUNGSI INI SEKARANG BISA MENANGANI "SELESAI" DAN "BATAL" ---
  const handleToggleCompleteChallenge = async (challenge) => {
    if (!currentUser || isProcessing) return;

    const newCompletedStatus = !challenge.completed;
    const originalChallenges = [...dailyChallenges];

    setIsProcessing(challenge.id);

    // Optimistic UI update
    setDailyChallenges(prev => prev.map(ch => ch.id === challenge.id ? { ...ch, completed: newCompletedStatus } : ch));

    const challengeStatusDocRef = doc(db, `users/${currentUser.uid}/challengeStatuses/${todayDateString}/challenges`, challenge.id);

    try {
      if (newCompletedStatus) {
        // --- LOGIKA UNTUK MENANDAI SELESAI ---
        await setDoc(challengeStatusDocRef, {
          completed: true,
          title: challenge.title,
          category: challenge.category,
          lastUpdated: serverTimestamp()
        }, { merge: true });

        const functionUrl = 'https://us-central1-lomba-mood-kuatdiri.cloudfunctions.net/processChallengeCompletion';
        const res = await fetch(functionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.uid, challenge: challenge })
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error?.message || 'Gagal memproses pencapaian.');
        }
        toast.success(result.data.message);
      } else {
        // --- LOGIKA BARU UNTUK MEMBATALKAN ---
        // Hapus dokumen status tantangan ini dari Firestore
        await deleteDoc(challengeStatusDocRef);
        toast.success("Tantangan berhasil dibatalkan.");
      }
    } catch (error) {
      console.error("Gagal mengubah status tantangan:", error);
      toast.error(error.message || "Gagal menyimpan progres Anda.");
      setDailyChallenges(originalChallenges); // Kembalikan UI jika gagal
    } finally {
      setIsProcessing(null);
    }
  };


  if (loadingAuth || isLoading) {
    return <div className="text-center p-6">Memuat tantangan...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Tantangan Harian Untukmu ✨</h1>
       <p className="  text-sm mb-8 text-center text-gray-800 dark:text-gray-100">Selesaikan Tantanganmu untuk menjadi orang yang Kuat </p>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {dailyChallenges.map((challenge) => (
          <div key={challenge.id} className={`group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 border-b-4 ${challenge.completed ? 'border-green-400' : 'border-teal-400'}`}>
            <div className="overflow-hidden">
              {challenge.imageUrl && <img src={challenge.imageUrl} alt={challenge.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"/>}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryClass(challenge.category)}`}>
                  {challenge.category}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">{challenge.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-grow">{challenge.description}</p>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-slate-700">
              {/* --- Tombol ini sekarang bisa diklik untuk membatalkan --- */}
              <button
                onClick={() => handleToggleCompleteChallenge(challenge)}
                disabled={isProcessing === challenge.id}
                className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-4 flex items-center justify-center ${
                    challenge.completed 
                    ? 'bg-transparent border border-gray-400 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700' 
                    : 'bg-teal-500 text-white hover:bg-teal-600 shadow-md'
                } ${isProcessing === challenge.id ? 'opacity-50 cursor-wait' : ''}`}
              >
                {challenge.completed ? (
                  <><XCircleIcon className="h-5 w-5 mr-2" /> Batalkan</>
                ) : (
                  'Tandai Selesai'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyChallengeScreen;
