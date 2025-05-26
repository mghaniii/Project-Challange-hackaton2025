// screens/SadariDiriPathScreen.js
import React from 'react';
import { Link } from 'react-router-dom';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const edukasiLevels = [
  { id: "1", title: "Level 1: Kenapa Judi Bikin Ketagihan?", isLocked: false, type: "Cerita" },
  { id: "2", title: "Level 2: Slot Itu Tipuan Matematika", isLocked: true, type: "Infografik" },
  // ...
];

function SadariDiriPathScreen() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-300">Jalur Sadari Diri: Anti-Judi</h1>
      <div className="space-y-4">
        {edukasiLevels.map((level, index) => (
          <Link
            key={level.id}
            to={level.isLocked ? '#' : `/sadari-diri/${level.id}`}
            className={`block p-6 rounded-lg shadow-lg transition-all ${
              level.isLocked
                ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-900 hover:shadow-xl hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.isLocked ? 'bg-gray-400 text-gray-700' : 'bg-teal-100 text-teal-700'}`}>
                  Level {index + 1}
                </span>
                <h2 className={`mt-1 text-lg font-semibold ${level.isLocked ? 'text-gray-500' : 'text-teal-700'}`}>
                  {level.title}
                </h2>
                <p className={`text-sm ${level.isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tipe: {level.type}
                </p>
              </div>
              {level.isLocked ? <LockClosedIcon className="h-6 w-6 text-gray-400" /> : <LockOpenIcon className="h-6 w-6 text-green-500" />}
              {/* <span className="text-2xl">{level.isLocked ? '🔒' : '🟢'}</span> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default SadariDiriPathScreen;