// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase'; // ✅ (PENTING) Impor auth dan db dari firebase.js Anda
import { signInAnonymously, onAuthStateChanged } from "firebase/auth"; // ✅ Impor fungsi auth
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"; // ✅ Impor fungsi Firestore

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Hapus userName, saveUserName, dll. jika tidak lagi relevan atau sesuaikan
  // Kita akan fokus pada user dari Firebase dan moodHistory
  const [currentUser, setCurrentUser] = useState(null); // ✅ State untuk pengguna Firebase
  const [loadingAuth, setLoadingAuth] = useState(true); // ✅ State untuk loading status autentikasi
  const [moodHistory, setMoodHistory] = useState([]);
  const [loadingMoods, setLoadingMoods] = useState(true); // ✅ State untuk loading moods

  // 1. Handle Autentikasi Anonim
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna sudah login (termasuk anonim yang baru dibuat atau yang sudah ada)
        setCurrentUser(user);
        console.log("User Authenticated (UID):", user.uid);
      } else {
        // Tidak ada pengguna, coba login anonim
        signInAnonymously(auth)
          .then((userCredential) => {
            setCurrentUser(userCredential.user);
            console.log("New Anonymous user signed in (UID):", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Anonymous sign-in error:", error);
            // Handle error, mungkin tampilkan pesan ke pengguna
          });
      }
      setLoadingAuth(false);
    });

    // Cleanup listener saat komponen unmount
    return () => unsubscribeAuth();
  }, []);


  // 2. Ambil Mood History secara Real-time dari Firestore setelah user terautentikasi
  useEffect(() => {
    if (currentUser) { // Hanya jalankan jika currentUser sudah ada (terautentikasi)
      setLoadingMoods(true);
      const moodsCollectionRef = collection(db, "moods");
      // Buat query untuk mendapatkan mood hanya milik currentUser, diurutkan berdasarkan waktu
      const q = query(
        moodsCollectionRef,
        where("userId", "==", currentUser.uid), // ✅ Filter berdasarkan userId
        orderBy("timestamp", "desc") // ✅ Urutkan dari yang terbaru
      );

      const unsubscribeMoods = onSnapshot(q, (querySnapshot) => {
        const moods = [];
        querySnapshot.forEach((doc) => {
          moods.push({ id: doc.id, ...doc.data() });
        });
        setMoodHistory(moods);
        setLoadingMoods(false);
      }, (error) => {
        console.error("Error fetching mood history: ", error);
        setLoadingMoods(false);
        // Handle error
      });

      // Cleanup listener saat komponen unmount atau currentUser berubah
      return () => unsubscribeMoods();
    } else {
      // Jika tidak ada currentUser, kosongkan moodHistory atau handle sesuai kebutuhan
      setMoodHistory([]);
      setLoadingMoods(false);
    }
  }, [currentUser]); // ✅ Jalankan effect ini setiap kali currentUser berubah


  // 3. Fungsi untuk menambahkan entri mood baru ke Firestore
  const addMoodEntry = async (moodValue) => {
    if (!currentUser) {
      console.error("Tidak bisa menambah mood, pengguna belum terautentikasi.");
      // Mungkin tampilkan pesan error ke pengguna
      return;
    }
    try {
      const moodsCollectionRef = collection(db, "moods");
      await addDoc(moodsCollectionRef, {
        userId: currentUser.uid, // ✅ Simpan UID pengguna anonim
        mood: moodValue,
        timestamp: serverTimestamp() // ✅ Gunakan serverTimestamp untuk waktu yang konsisten
      });
      console.log("Mood entry added to Firestore");
    } catch (error) {
      console.error("Error adding mood entry: ", error);
      // Handle error, mungkin tampilkan pesan ke pengguna
    }
  };

  // Fungsi saveUserName, clearUserName, skipNameInput mungkin perlu disesuaikan atau dihapus
  // tergantung apakah Anda masih ingin fitur input nama di luar sistem user Firebase.
  // Untuk saat ini, kita fokus pada currentUser dari Firebase.
  // Jika Anda masih ingin menggunakan nama, Anda bisa menyimpannya di Firestore
  // dalam collection 'users' yang berelasi dengan currentUser.uid.

  return (
    <UserContext.Provider value={{
      currentUser,       // Sediakan currentUser
      loadingAuth,       // Sediakan status loading auth
      moodHistory,       // Sediakan moodHistory dari Firestore
      loadingMoods,      // Sediakan status loading moods
      addMoodEntry       // Sediakan fungsi addMoodEntry yang baru
      // ...sertakan state dan fungsi lain yang masih relevan
    }}>
      {children}
    </UserContext.Provider>
  );
};