// import React, { useState } from 'react';
// import axios from 'axios';

// function ChatComponent() {


    
//   // 1. State untuk mengelola data
//   const [prompt, setPrompt] = useState(''); // Menyimpan teks input dari pengguna
//   const [response, setResponse] = useState(''); // Menyimpan jawaban dari AI
//   const [loading, setLoading] = useState(false); // Menandakan apakah sedang menunggu jawaban
//   const [error, setError] = useState(''); // Menyimpan pesan error jika terjadi

//   // 2. Mengambil kunci API dari environment variable
//   const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

//   // 3. Fungsi yang dijalankan saat tombol "Kirim" ditekan
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Mencegah form dari refresh halaman
//     setLoading(true);
//     setResponse('');
//     setError('');

//     try {
//       // 4. Konfigurasi dan pengiriman permintaan menggunakan axios
//       const result = await axios.post(
//         'https://api.deepseek.com/chat/completions', // Endpoint API DeepSeek
//         {
//           // Body atau isi permintaan
//           model: 'deepseek-chat', // Model AI yang digunakan
//           messages: [
//             { role: 'system', content: 'You are a helpful assistant.' },
//             { role: 'user', content: prompt },
//           ],
//         },
//         {
//           // Header permintaan
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`, // Kunci API disertakan di sini
//           },
//         }
//       );

//       // 5. Mengambil dan menyimpan jawaban dari AI
//       setResponse(result.data.choices[0].message.content);

//     } catch (err) {
//       // 6. Penanganan jika terjadi error
//       setError('Gagal terhubung ke API. Periksa kembali kunci API dan koneksi Anda.');
//       console.error(err);
//     } finally {
//       // 7. Proses ini selalu dijalankan, baik sukses maupun gagal
//       setLoading(false);
//     }
//   };

//   // 8. Tampilan antarmuka (UI) dari komponen
//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//       <h1>Chat dengan DeepSeek AI</h1>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Tuliskan pertanyaan Anda..."
//           style={{ width: '100%', minHeight: '80px', padding: '10px' }}
//         />
//         <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px 20px' }}>
//           {loading ? 'Sedang Memproses...' : 'Kirim'}
//         </button>
//       </form>

//       {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

//       {response && (
//         <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
//           <h2>Jawaban:</h2>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatComponent;