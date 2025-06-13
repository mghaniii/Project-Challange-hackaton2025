
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

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
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, 'asia-southeast2');


export { db, auth, functions };



