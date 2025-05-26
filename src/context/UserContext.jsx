// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Initial state: null berarti belum ada interaksi nama (prompt belum muncul/selesai)
  // "" (string kosong) berarti pengguna memilih untuk melewati input nama
  // string berisi nama berarti pengguna telah memasukkan nama
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('sadariDiriUserName');
    // Jika ada nama tersimpan (bahkan string kosong untuk menandai 'skip'), gunakan itu.
    // Jika tidak ada (pertama kali visit atau localStorage dihapus), userName tetap null.
    if (storedName !== null) {
      setUserName(storedName);
    }
  }, []);

  const saveUserName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName) { // Hanya simpan jika nama tidak kosong setelah di-trim
      localStorage.setItem('sadariDiriUserName', trimmedName);
      setUserName(trimmedName);
    } else {
      // Jika pengguna submit form kosong, anggap sama dengan skip
      skipNameInput();
    }
  };

  const skipNameInput = () => {
    localStorage.setItem('sadariDiriUserName', ""); // Simpan string kosong untuk menandai 'skip'
    setUserName("");
  };

  const clearUserName = () => {
    localStorage.removeItem('sadariDiriUserName');
    setUserName(null); // Kembali ke kondisi awal, akan memunculkan prompt lagi
  };

  return (
    <UserContext.Provider value={{ userName, saveUserName, clearUserName, skipNameInput }}>
      {children}
    </UserContext.Provider>
  );
};