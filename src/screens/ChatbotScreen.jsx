// file: screens/ChatbotScreen.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSmartReply } from '../services/aiService';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Komponen Avatar untuk Pengguna
const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
    You
  </div>
);

// Komponen Avatar untuk AI
const AiAvatar = ({ mode }) => (
  <div className="w-8 h-8 rounded-full bg-slate-600 dark:bg-slate-200 flex items-center justify-center font-bold text-white dark:text-slate-800 text-sm flex-shrink-0">
    {mode.charAt(0).toUpperCase()}
  </div>
);


function ChatbotScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const aiMode = searchParams.get('mode') || 'default';
  const aiModeName = aiMode.charAt(0).toUpperCase() + aiMode.slice(1);

  // Inisialisasi state dari Local Storage
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem(`chatHistory-${aiMode}`);
      return savedMessages ? JSON.parse(savedMessages) : [{ sender: 'ai', text: `Halo! Saya **${aiModeName} AI**. Silahkan kirim pesan saya akan membantu anda` }];
    } catch (error) {
      console.error("Gagal memuat riwayat chat:", error);
      return [{ sender: 'ai', text: `Halo! Saya **${aiModeName} AI**. Silakan ketik pesan Anda.` }];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);


  useEffect(() => {
    try {
      if (messages.length > 1) { // Hanya simpan jika sudah ada percakapan
        localStorage.setItem(`chatHistory-${aiMode}`, JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Gagal menyimpan riwayat chat:", error);
    }
  }, [messages, aiMode]);

  // Efek untuk auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fungsi untuk mengirim pesan
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getSmartReply(input, aiMode); 
      const aiMessage = { sender: 'ai', text: aiResponse.reply, sentiment: aiResponse.sentiment };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Gagal terhubung ke server AI.";
      toast.error(errorMessage);
      setMessages(prev => [...prev, {sender: 'ai', text: 'Maaf, sepertinya ada sedikit gangguan di sirkuitku.'}]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menghapus riwayat
  const handleClearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dengan mode ini?")) {
      localStorage.removeItem(`chatHistory-${aiMode}`);
      setMessages([{ sender: 'ai', text: `Riwayat percakapan telah dibersihkan. Mulai obrolan baru!` }]);
      toast.success("Riwayat percakapan telah dihapus!");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl">
      
      {/* Header Chat */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/ngobrol-ai')} 
            className="mr-3 p-2 text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Kembali ke pemilihan mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold capitalize text-slate-800 dark:text-white">{aiModeName} AI</h1>
        </div>
        <button onClick={handleClearHistory} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" aria-label="Hapus riwayat">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Jendela Chat */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => {
          if (msg.sender === 'user') {
            return (
              <div key={index} className="flex justify-end items-start space-x-4">
                <div className="max-w-lg bg-teal-600 text-white p-3 rounded-2xl rounded-br-none shadow-md">
                  <p className="text-base whitespace-pre-wrap">{msg.text}</p>
                </div>
                <UserAvatar />
              </div>
            );
          } else {
            return (
              <div key={index} className="flex justify-start items-start space-x-4">
                <AiAvatar mode={aiMode}/>
                <div className="prose prose-slate dark:prose-invert max-w-none pt-0.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            );
          }
        })}

        {isLoading && (
          <div className="flex items-start space-x-4">
            <AiAvatar mode={aiMode}/>
            <div className="animate-pulse text-slate-500 dark:text-slate-400 pt-1">AI sedang berpikir...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Form Input Pesan */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-3 items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-xl shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Kirim pesan ke ${aiModeName} AI...`}
            className="flex-grow p-2 bg-transparent text-slate-800 dark:text-white rounded-lg focus:outline-none"
            disabled={isLoading}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold w-10 h-10 flex items-center justify-center rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-110"
            disabled={isLoading}
            aria-label="Kirim pesan"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.789 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatbotScreen;