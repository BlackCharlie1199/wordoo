import { Routes, Route, Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import MyWord from './pages/MyWord';
import Setting from './pages/Setting';
import WordBank from './pages/WordBank';
import './index.css';
import './styles/header.css';
import './styles/footer.css';
import { loadUserLanguage } from './pages/helper';

const App = () => {


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
      <footer className="footer-bar">© 2025 wordoo</footer>
    </>
  )
};

export default App;