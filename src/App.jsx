import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ChatbotScreen from './screens/ChatbotScreen.jsx';
import DailyChallengeScreen from './screens/DailyChallengeScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import NgobrolAiScreen from './screens/NgobrolAiScreen.jsx'; 
import SadariDiriPathScreen from './screens/SadariDiriPathScreen.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeScreen />} />
            <Route path="/chat" element={<ChatbotScreen />} />
              <Route path="/challenges" element={<DailyChallengeScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/ngobrol-ai" element={<NgobrolAiScreen />} />
              <Route path="/sadari-diri" element={<SadariDiriPathScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
