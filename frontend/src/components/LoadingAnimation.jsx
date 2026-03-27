import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TEXTS = [
  "Loading audio file...",
  "Generating mel spectrogram...",
  "Running CNN feature extraction...",
  "Processing BiLSTM sequences...",
  "Calculating genre confidence...",
  "Almost there..."
];

export default function LoadingAnimation() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const bars = [
    { baseHeight: 20, duration: 0.4 },
    { baseHeight: 45, duration: 0.5 },
    { baseHeight: 35, duration: 0.45 },
    { baseHeight: 60, duration: 0.6 },
    { baseHeight: 40, duration: 0.4 },
    { baseHeight: 55, duration: 0.55 },
    { baseHeight: 25, duration: 0.45 },
  ];

  return (
    <div className="glass-card flex flex-col items-center justify-center max-w-md w-full mx-auto my-8 p-16 relative overflow-hidden">
      
      {/* ── Top section — AI brain visual ──────────────────── */}
      <div className="relative mb-10 flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{ 
            border: '2px dashed rgba(108,99,255,0.4)',
            boxShadow: 'inset 0 0 20px rgba(108,99,255,0.1)'
          }}
        />
        {/* Inner ring */}
        <div 
          className="absolute rounded-full"
          style={{ 
            width: 80, height: 80,
            border: '2px solid var(--brand-violet)',
            animation: 'spin-slow 5s linear infinite reverse',
            boxShadow: '0 0 15px rgba(108,99,255,0.3)'
          }}
        />
        {/* Center icon */}
        <div 
          className="absolute flex items-center justify-center animate-pulse-glow rounded-full"
          style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}
        >
          <span style={{ fontSize: '32px', transform: 'translateY(-2px)' }}>🧠</span>
        </div>
      </div>

      {/* ── Equalizer bars ─────────────────────────────────── */}
      <div className="flex items-end justify-center h-[60px] w-full mb-8 gap-[6px]">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="rounded-t-[4px]"
            style={{ 
              width: '8px',
              height: `${bar.baseHeight}px`,
              background: 'linear-gradient(to top, #6C63FF, #38F9D7)',
              transformOrigin: 'bottom'
            }}
            animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ── Cycling status messages ────────────────────────── */}
      <div className="h-6 relative w-full flex justify-center mb-8 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute text-center gradient-text"
            style={{ fontSize: '16px', fontWeight: 600, width: '100%', whiteSpace: 'nowrap' }}
          >
            {LOADING_TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Progress bar ───────────────────────────────────── */}
      <div 
        className="w-full h-[6px] rounded-[3px] overflow-hidden"
        style={{ background: 'rgba(108,99,255,0.15)' }}
      >
        <motion.div
          className="h-full rounded-[3px]"
          style={{ background: 'linear-gradient(to right, #6C63FF, #FF6584, #38F9D7)' }}
          initial={{ width: "0%" }}
          animate={{ width: "90%" }}
          transition={{
            duration: 2.5,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
