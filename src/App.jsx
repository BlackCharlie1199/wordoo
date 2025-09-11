import React from 'react';

const App = () => {
  const handleClick = (buttonName) => {
    alert(`${buttonName} button clicked!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (QVGA: fixed 40px height) */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-blue-500 text-white flex items-center justify-center font-bold text-[24pt]">
        quizlet
      </header>

      {/* Main content area (centered below header) */}
      <main className="pt-10 min-h-[calc(100vh-40px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => handleClick('MyWord')}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white shadow-md transition-colors transition-shadow hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            MyWord
          </button>
          <button
            type="button"
            onClick={() => handleClick('Setting')}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white shadow-md transition-colors transition-shadow hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Setting
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
