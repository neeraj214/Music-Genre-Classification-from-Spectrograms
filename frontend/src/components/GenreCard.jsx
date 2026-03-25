import React from 'react';
import { motion } from 'framer-motion';
import { GENRE_COLORS, GENRE_EMOJIS } from '../utils/genreColors';
import { capitalizeGenre, formatConfidence } from '../utils/formatters';

export default function GenreCard({ genre, score, isTop }) {
  const color = GENRE_COLORS[genre] || '#94a3b8';
  const emoji = GENRE_EMOJIS[genre] || '🎵';
  const genreName = capitalizeGenre(genre);
  const formattedScore = formatConfidence(score);
  const percentScore = score <= 1 ? score * 100 : score;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isTop ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl relative p-5 flex flex-col items-center"
      style={{
        borderTop: `4px solid ${color}`,
        boxShadow: isTop 
          ? `0 10px 25px -5px ${color}66, 0 8px 10px -6px ${color}33` 
          : '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        zIndex: isTop ? 10 : 1
      }}
    >
      {isTop && (
        <span 
          className="absolute -top-3 px-3 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider"
          style={{ backgroundColor: color }}
        >
          TOP PICK
        </span>
      )}

      <div className="text-4xl mb-3 mt-2">{emoji}</div>
      
      <div className="text-slate-700 font-bold text-lg mb-1">{genreName}</div>
      
      <div 
        className="font-bold text-xl mb-3" 
        style={{ color }}
      >
        {formattedScore}
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentScore}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
