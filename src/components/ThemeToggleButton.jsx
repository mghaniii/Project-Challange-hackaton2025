// src/components/ThemeToggleButton.jsx
import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Gun

function ThemeToggleButton() {
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="w-full px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white text-sm"
    >
      {dark ? '🌙 Mode Gelap' : '☀️ Mode Terang'}
    </button>
  );
}

export default ThemeToggleButton;
