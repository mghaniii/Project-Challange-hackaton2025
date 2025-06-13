
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, addDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [moodHistory, setMoodHistory] = useState([]);
  const [loadingMoods, setLoadingMoods] = useState(true);
  
  const [userBadges, setUserBadges] = useState({});
  // State baru untuk progres "Jalur Sadari Diri"
  const [sadariDiriProgress, setSadariDiriProgress] = useState(0);

  // Handle Autentikasi Pengguna
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        signInAnonymously(auth).catch((error) => console.error("Anonymous sign-in error:", error));
      }
      setLoadingAuth(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Handle pengambilan SEMUA data Firestore secara real-time saat pengguna berubah
  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeMoods = () => {};

    if (currentUser) {
      // Listener untuk data user (badges dan progres edukasi)
      const userDocRef = doc(db, 'users', currentUser.uid);
      unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ambil data badge
          setUserBadges(data.badges || {});
          // Ambil data progres Sadari Diri
          setSadariDiriProgress(data.sadariDiriProgress || 0);
        } else {
          // Jika dokumen user belum ada, set semuanya ke default
          setUserBadges({});
          setSadariDiriProgress(0);
        }
      });

      // Listener untuk Mood History
      setLoadingMoods(true);
      const moodsQuery = query(collection(db, "moods"), where("userId", "==", currentUser.uid), orderBy("timestamp", "desc"));
      unsubscribeMoods = onSnapshot(moodsQuery, (snapshot) => {
        const moods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMoodHistory(moods);
        setLoadingMoods(false);
      }, (error) => {
        console.error("Error fetching mood history:", error);
        setLoadingMoods(false);
      });

    } else {
      // Reset semua data jika tidak ada user
      setUserBadges({});
      setSadariDiriProgress(0);
      setMoodHistory([]);
      setLoadingMoods(false);
    }
    
    // Cleanup listeners s
    return () => {
      unsubscribeUser();
      unsubscribeMoods();
    };
  }, [currentUser]);

  // Fungsi untuk menambah mood
  const addMoodEntry = async (moodValue) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "moods"), {
        userId: currentUser.uid,
        mood: moodValue,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding mood entry: ", error);
    }
  };

  // Fungsi untuk menyelesaikan level di Jalur Sadari Diri
  const completeSadariDiriLevel = async (levelId) => {
    if (!currentUser) return;
    const levelNumber = parseInt(levelId, 10);
    // Hanya update jika level yang diselesaikan lebih tinggi dari progres saat ini
    if (levelNumber > sadariDiriProgress) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        
        await setDoc(userDocRef, { sadariDiriProgress: levelNumber }, { merge: true });
        console.log(`Progres Sadari Diri berhasil disimpan: Level ${levelNumber}`);
      } catch (error) {
        console.error("Gagal menyimpan progres Sadari Diri:", error);
      }
    }
  };


  const value = {
    currentUser,
    loadingAuth,
    moodHistory,
    loadingMoods,
    addMoodEntry,
    userBadges,
    sadariDiriProgress,
    completeSadariDiriLevel,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
