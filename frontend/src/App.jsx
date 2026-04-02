import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col relative font-['Inter'] text-slate-800" style={{ backgroundColor: '#F8F7FF' }}>
      
      {/* ── Background Orbs & Dots (Persisting across all app) ── */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#F8F7FF]">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(var(--border-medium) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.3
          }}
        />
        {/* Faint Orbs */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--brand-violet)' }}
        />
        <div 
          className="absolute top-[40%] right-[-10%] w-[40%] h-[50%] rounded-full blur-[120px] opacity-[0.15]"
          style={{ background: 'var(--brand-cyan)' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10"
          style={{ background: 'var(--brand-pink)' }}
        />
      </div>

      <Navbar />
      
      <main className="flex-grow flex flex-col w-full z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<UploadPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
