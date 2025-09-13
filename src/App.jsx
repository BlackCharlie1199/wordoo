import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import MyWord from './pages/MyWord';
import Setting from './pages/Setting';
import './index.css';
import './styles/header.css';

const App = () => {
  return (
    <Router>
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
    </Router>
  )
};

export default App;