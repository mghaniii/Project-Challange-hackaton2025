// screens/NgobrolAiScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { FaTheaterMasks, FaRegLaughSquint, FaGuitar, FaHeart } from 'react-icons/fa';

const aiModes = [
  { name: "Roasting AI", slug: "roasting", emoji: "🔥", description: "Siap di-roasting sama AI?" },
  { name: "Lawak AI", slug: "lawak", emoji: "😂", description: "Dapatkan dosis tawa harianmu." },
  { name: "Skena AI", slug: "skena", emoji: "🎶", description: "Obrolan anak skena indie." },
  { name: "Gombalan AI", slug: "gombalan", emoji: "💖", description: "Bikin hatimu meleleh." },
];

function NgobrolAiScreen() {
  const navigate = useNavigate();

  const handleModeSelect = (slug) => {
    navigate(`/chat?ai_mode=${slug}`); // Atau rute khusus /chat-ai/:mode
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ngobrol AI Seru</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {aiModes.map((mode) => (
          <button
            key={mode.slug}
            onClick={() => handleModeSelect(mode.slug)}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <span className="text-4xl block mb-2">{mode.emoji}</span>
            <h2 className="text-xl font-semibold text-teal-600 mb-1">{mode.name}</h2>
            <p className="text-gray-600 text-sm">{mode.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
export default NgobrolAiScreen;