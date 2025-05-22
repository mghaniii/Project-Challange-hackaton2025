// screens/DailyChallengeScreen.js
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';



const challenges = [
  { id: "1", title: "Syukur Pagi", description: "Tulis 3 hal yang kamu syukuri hari ini.", completed: false },
  { id: "2", title: "Minum Air", description: "Minum 8 gelas air putih hari ini.", completed: true },
  // ...
];

function DailyChallengeScreen() {
  // Logika untuk menandai challenge selesai, dll.

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Challenge Harian</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${challenge.completed ? 'border-green-500' : 'border-yellow-500'}`}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{challenge.title}</h2>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex justify-end space-x-2">
              {!challenge.completed && (
                <button className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  Lewati
                </button>
              )}
              <button
                className={`px-4 py-2 text-sm text-white rounded ${
                  challenge.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {challenge.completed ? 'Selesai!' : 'Selesaikan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DailyChallengeScreen;