
import axios from 'axios';

const API_URL = 'https://project-challange-hackaton2025.onrender.com/api/chat-cerdas';

/**
 * Mengirim pesan dan mode ke backend AI.
 * @param {string} message - Pesan dari pengguna.
 * @param {string} mode - Mode kepribadian AI (misal: 'lawak').
 * @returns {Promise<object>} - Objek berisi balasan dan sentimen.
 */
const getSmartReply = async (message, mode) => {
  try {
    const response = await axios.post(API_URL, {
      message: message,
      mode: mode, // Kirim mode yang relevan ke backend
    });
    return response.data;
  } catch (error) {
    console.error("Error saat menghubungi AI service:", error);
    throw error; // Lempar error agar komponen bisa menanganinya
  }
};

export { getSmartReply };