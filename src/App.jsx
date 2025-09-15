import { Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import MyWord from './pages/MyWord';
import Setting from './pages/Setting';
import './index.css';
import './styles/header.css';

const App = () => {

  // set the default lang and store it in the local storage 
  const DEFAULT_LANG = "en";
  if (!localStorage.getItem("language")) localStorage.setItem("language", DEFAULT_LANG);

  return (
    <>
      {/* Header Component */}
      <header className="header-title">quizlet</header>

      {/* Main content area */}
      <main className="pt-12 min-h-[calc(100vh-40px)] flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myword" element={<MyWord />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </main>
    </>
  )
};

export default App;