// src/main.jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // File CSS global Anda (yang berisi @tailwind directives)
import { ThemeProvider } from './context/ThemeContext.jsx'; // << IMOR THEME PROVIDER
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* << BUNGKUS APP DENGAN THEME PROVIDER */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);