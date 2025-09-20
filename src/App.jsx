import { Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { FaPlus, FaBook} from 'react-icons/fa';
import Home from './pages/Home';
import MyWord from './pages/MyWord';
import Setting from './pages/Setting';
import WordBank from './pages/WordBank';
import Quiz from './pages/Quiz';
import Learn from './pages/Learn';
import Spell from './pages/Spell';
import './index.css';
import './styles/header.css';
import './styles/footer.css';
import { loadUserLanguage } from './pages/helper';


const App = () => {

  const location = useLocation();
  const showAddButton = location.pathname.startsWith("/myword");
  const hideFooter = location.pathname.startsWith("/spell");

  useEffect(() => {
    loadUserLanguage();
  }, []);
  

  return (
    <div className="overflow-x-hidden">
      {/* Header Component */}
      <header className="header-title">
        <Link to="/">Wordoo</Link>
      </header>

      {/* Main content area */}
      <main className="pt-10 pb-10 min-h-[calc(100vh-40px)] flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myword" element={<MyWord />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/myword/wordbank/:id" element={<WordBank/>} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/learn/:id" element={<Learn />} />
          <Route path="/spell/:id" element={<Spell />} />
        </Routes>
      </main>

      {/* Footer Component */}
      {!hideFooter && (
      <footer className="footer-bar px-10">
        {showAddButton && (
          <div className='flex justify-between w-full'>
            {/* 左邊加號 */}
            <button
              onClick={() => {
                window.dispatchEvent(new Event("add"));
              }}
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
            >
              <FaPlus size={16} />
            </button>

            {/* 右邊書本 */}
            <button
              onClick={() => {
                window.dispatchEvent(new Event("review"));
              }}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
            >
              <FaBook size={16} />
            </button>
          </div>
        )}
      </footer>
    )}
    </div>
  )
};

export default App;