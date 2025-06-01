
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Ganti dengan konfigurasi proyek Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBG92QNeT9eyBK3Edo1euaCdQJsT1z3Rtc",
  authDomain: "lomba-mood-kuatdiri.firebaseapp.com",
  projectId: "lomba-mood-kuatdiri",
  storageBucket: "lomba-mood-kuatdiri.firebasestorage.app",
  messagingSenderId: "979027446761",
  appId: "1:979027446761:web:51fc5ef8b63b7aab235978"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan yang akan digunakan
const db = getFirestore(app); // Firestore Database
const auth = getAuth(app);   // Firebase Authentication

export { db, auth };