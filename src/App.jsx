// src/App.jsx

// Langkah 1: Impor React dan Suspense
import React, { Suspense } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout.jsx';

// Langkah 2: Ubah semua impor screen menjadi 'React.lazy'
const LandingScreen = React.lazy(() => import('./screens/LandingScreen.jsx'));
const HomeScreen = React.lazy(() => import('./screens/HomeScreen.jsx'));
const ChatbotScreen = React.lazy(() => import('./screens/ChatbotScreen.jsx'));
const DailyChallengeScreen = React.lazy(() => import('./screens/DailyChallengeScreen.jsx'));
const DashboardScreen = React.lazy(() => import('./screens/DashboardScreen.jsx'));
const NgobrolAiScreen = React.lazy(() => import('./screens/NgobrolAiScreen.jsx')); 
const SadariDiriPathScreen = React.lazy(() => import('./screens/SadariDiriPathScreen.jsx'));
const EdukasiLevelScreen = React.lazy(() => import('./screens/EdukasiLevelScreen.jsx'));

// Komponen untuk tampilan loading saat halaman berpindah
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-900">
    <p className="text-lg text-slate-500 dark:text-slate-400">Memuat halaman...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      
      {/* Langkah 3: Bungkus <Routes> dengan <Suspense> */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            
            {/* Rute Anda tidak perlu diubah, semua tetap sama */}
            <Route index element={<LandingScreen />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="chat" element={<ChatbotScreen />} />
            <Route path="challenges" element={<DailyChallengeScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="ngobrol-ai" element={<NgobrolAiScreen />} />
            <Route path="sadari-diri" element={<SadariDiriPathScreen />} />
            <Route path="sadari-diri/:levelId" element={<EdukasiLevelScreen />} />

          </Route>
          
          {/* Rute tanpa MainLayout (jika ada) */}
          {/* <Route path="/login" element={<LoginScreen />} /> */} 
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;