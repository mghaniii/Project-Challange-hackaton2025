// src/components/ThemeToggleButton.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Assuming you have a ThemeContext
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function ThemeToggleButton({ collapsed }) { // Accept collapsed prop
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 text-gray-300 hover:text-white
                  transition-all duration-150 ease-in-out group
                  ${collapsed ? 'w-full flex justify-center' : 'flex items-center space-x-2 min-w-[140px]'}`} // Adjust min-width as needed
      title={collapsed ? (isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode") : undefined}
    >
      {isDarkMode ? (
        <SunIcon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'} flex-shrink-0`} />
      ) : (
        <MoonIcon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'} flex-shrink-0`} />
      )}
      {!collapsed && (
        <span className="text-sm font-medium transition-opacity duration-200">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggleButton;