// screens/ChatbotScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Untuk mengambil query param 'mood'

function ChatbotScreen() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const initialMood = new URLSearchParams(location.search).get('mood');
  const messagesEndRef = useRef(null); // Untuk auto-scroll

  useEffect(() => {
    // Pesan selamat datang dari chatbot berdasarkan mood
    if (initialMood) {
      addBotMessage(`Hai! Kamu lagi merasa ${initialMood}, ya? Ada yang mau diceritain?`);
    } else {
      addBotMessage("Halo! Ada yang bisa aku bantu hari ini?");
    }
  }, [initialMood]);

  useEffect(() => { // Auto-scroll ke pesan terbaru
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender, time: new Date() }]);
  };

  const addUserMessage = (text) => addMessage(text, 'user');
  const addBotMessage = (text) => addMessage(text, 'bot');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    addUserMessage(inputValue);
    // Logika chatbot untuk merespons
    // Ini bisa menjadi pemanggilan API ke backend NLU atau logika sederhana
    const botResponse = getBotResponse(inputValue, initialMood);
    setTimeout(() => addBotMessage(botResponse), 500); // Simulasi delay bot
    setInputValue('');
  };

  const getBotResponse = (userInput, mood) => {
    // Implementasi logika respons chatbot (bisa lebih kompleks)
    if (userInput.toLowerCase().includes("halo")) return "Halo juga!";
    if (userInput.toLowerCase().includes("bantu") && (mood === "Sedih" || mood === "Cemas")) {
      // Sarankan aktivitas atau challenge
      setTimeout(() => addBotMessage("Mungkin kamu mau coba challenge 'Tulis 3 hal yang disyukuri hari ini'? Itu bisa bantu lho."), 100);
      return "Aku punya beberapa saran aktivitas yang mungkin bisa membantu. Mau coba?";
    }
    return "Aku dengerin kok. Cerita aja.";
  };

 return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-300">
      {/* Header Chat */}
      <div className="bg-teal-500 dark:bg-teal-600 text-white p-4">
        <h2 className="text-xl font-semibold">Ngobrol Santai</h2>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-xs block text-right mt-1 ${
                msg.sender === 'user' ? 'opacity-75' : 'opacity-75 dark:text-gray-400'
              }`}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Pesan */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-300">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pesanmu..."
            className="flex-1 p-3 border rounded-l-lg focus:ring-teal-500 focus:border-teal-500 outline-none bg-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white p-3 rounded-r-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
export default ChatbotScreen;