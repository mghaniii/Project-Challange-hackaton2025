
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Definisikan mode-mode AI kita di sini agar mudah dikelola
const aiModes = [
  { name: "Lawak AI", slug: "lawak", emoji: "😂", description: "Dapatkan dosis tawa harianmu." },
  { name: "Roasting AI", slug: "roasting", emoji: "🔥", description: "Siap mental di-roasting sama AI? Cuma buat yang kuat mental!" },
  { name: "Gombalan AI", slug: "gombal", emoji: "💖", description: "Bikin hatimu meleleh dengan rayuan maut dari AI." },
  { name: "Asisten Cerdas", slug: "default", emoji: "💡", description: "Ngobrol santai dengan asisten AI yang membantu." },
];

function NgobrolAiScreen() {
  const navigate = useNavigate();

  // Fungsi ini akan dipanggil saat sebuah mode dipilih
  const handleModeSelect = (slug) => {
  
    navigate(`/chat?mode=${slug}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 dark:text-gray-200">Ngobrol Seru dengan AI</h1>
      <p className="text-md text-gray-500 mb-6">Pilih kepribadian AI yang kamu mau ajak ngobrol hari ini.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {aiModes.map((mode) => (
          <button
            key={mode.slug}
            onClick={() => handleModeSelect(mode.slug)}
            className="bg-gray-800 bg-slate-50 dark:bg-slate-800 hover:bg-gray-100 hover:shadow-xl text-left p-6 rounded-lg transition-transform transform hover:-translate-y-1"
          >
            <span className="text-4xl block mb-3">{mode.emoji}</span>
            <h2 className="text-xl font-semibold text-teal-400 mb-1">{mode.name}</h2>
            <p className="text-gray-400 text-sm">{mode.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NgobrolAiScreen;