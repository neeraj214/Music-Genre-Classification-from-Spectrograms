import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_COLORS } from '../utils/genreColors';

const LOADING_TEXTS = [
  "Analyzing audio patterns...",
  "Extracting mel spectrogram...",
  "Running CNN + BiLSTM model..."
];

export default function LoadingAnimation() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Use a mix of colors to cycle through the UI colors
  const bars = [
    { duration: 0.4, color: GENRE_COLORS.disco },
    { duration: 0.5, color: GENRE_COLORS.rock },
    { duration: 0.6, color: GENRE_COLORS.classical },
    { duration: 0.5, color: GENRE_COLORS.hiphop },
    { duration: 0.4, color: GENRE_COLORS.pop },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center max-w-md w-full mx-auto my-8 space-y-8">
      {/* Equalizer Bars */}
      <div className="flex items-end justify-center gap-2 h-16 w-full">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="w-3 rounded-t-sm"
            style={{ 
              backgroundColor: bar.color, 
              height: '100%',
              transformOrigin: 'bottom'
            }}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Cycling Text */}
      <div className="h-6 relative w-full flex justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 font-medium text-center absolute w-full"
          >
            {LOADING_TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indeterminate Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
