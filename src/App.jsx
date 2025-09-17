import { Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Home from './pages/Home';
import MyWord from './pages/MyWord';
import Setting from './pages/Setting';
import WordBank from './pages/WordBank';
import './index.css';
import './styles/header.css';
import './styles/footer.css';
import { loadUserLanguage } from './pages/helper';

const App = () => {

  const location = useLocation();
  const showAddButton = location.pathname.startsWith("/myword");

  useEffect(() => {
    loadUserLanguage();
  }, []);
  


  return (
    <>
      {/* Header Component */}
      <header className="header-title">wordoo</header>

      {/* Main content area */}
      <main className="pt-10 pb-10 min-h-[calc(100vh-40px)] flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myword" element={<MyWord />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/myword/wordbank/:id" element={<WordBank/>} />
        </Routes>
      </main>

      {/* Footer Component */}
      <footer className="footer-bar">
        {showAddButton && (
          <button
            onClick={() => {
              window.dispatchEvent(new Event("addWordbank"));
            }}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <FaPlus size={16} />
          </button>
        )}
      </footer>
    </>
  )
};

export default App;