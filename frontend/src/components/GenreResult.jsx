import React, { useEffect } from 'react';
import { motion, useMotionValue, animate, useTransform, useReducedMotion } from 'framer-motion';
import { GENRE_COLORS, GENRE_EMOJIS } from '../utils/genreColors';
import { capitalizeGenre } from '../utils/formatters';
import GenreCard from './GenreCard';
import ConfidenceChart from './ConfidenceChart';

const AnimatedCounter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => `${latest.toFixed(1)}% confident`);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      count.set(value <= 1 ? value * 100 : value);
      return;
    }
    const target = value <= 1 ? value * 100 : value;
    const animation = animate(count, target, {
      duration: 2,
      ease: "easeOut"
    });
    return animation.stop;
  }, [value, count, shouldReduceMotion]);

  return <motion.span>{rounded}</motion.span>;
};

export default function GenreResult({ result }) {
  const { predicted_genre, confidence, all_scores, processing_time_ms, model_version } = result;
  
  const color = GENRE_COLORS[predicted_genre] || '#6C63FF';
  const emoji = GENRE_EMOJIS[predicted_genre] || '🎵';
  const genreName = capitalizeGenre(predicted_genre);
  
  const shouldReduceMotion = useReducedMotion();
  const sortedScores = [...all_scores].sort((a, b) => b.score - a.score);
  
  // Get 2nd and 3rd place securely, just in case array is short
  const secondPlace = sortedScores[1] || null;
  const thirdPlace = sortedScores[2] || null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-10 w-full max-w-6xl mx-auto my-8 font-['Inter']"
    >
      <style>
        {`
          @keyframes rotate {
            100% { transform: rotate(1turn); }
          }
        `}
      </style>

      {/* ── Section Title Row ──────────────────────── */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-[900] text-gray-900 tracking-tight">Your Result</h2>
      </div>

      {/* ── TOP: Prediction Hero Card ────────────────── */}
      <div 
        className="gradient-border relative overflow-hidden" 
        style={{ 
          padding: '48px', 
          textAlign: 'center', 
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#fff',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Tint Background layer */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: color, opacity: 0.05 }} 
        />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Emoji */}
          <div 
            className="text-[72px] mb-6 leading-none animate-bounce-soft"
            style={{ filter: `drop-shadow(0 10px 20px ${color}33)` }}
          >
            {emoji}
          </div>
          
          {/* Pre-title */}
          <div 
            style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              fontWeight: 800,
              color: 'var(--text-muted)',
              marginBottom: '4px'
            }}
          >
            Predicted Genre
          </div>

          {/* Genre Title */}
          <div 
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '64px',
              fontWeight: 900,
              color: color,
              lineHeight: 1.1,
              marginBottom: '24px',
              textShadow: `0 4px 12px ${color}1A`
            }}
          >
            {genreName}
          </div>

          {/* Confidence Badge */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: `0 8px 24px ${color}40`,
              marginBottom: processing_time_ms ? '12px' : '24px'
            }}
          >
            <AnimatedCounter value={confidence} />
          </div>

          {/* Processing Time Info Row */}
          {processing_time_ms && (
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', fontWeight: 500 }}>
              Analyzed in {(processing_time_ms / 1000).toFixed(1)}s &nbsp;&middot;&nbsp; Model v{model_version || '1.0.0'}
            </div>
          )}

          {/* Runner ups */}
          <div className="flex gap-4">
            {secondPlace && (
              <div className="glass-card" style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                2nd: {capitalizeGenre(secondPlace.genre)} ({(secondPlace.score * 100).toFixed(1)}%)
              </div>
            )}
            {thirdPlace && (
              <div className="glass-card" style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                3rd: {capitalizeGenre(thirdPlace.genre)} ({(thirdPlace.score * 100).toFixed(1)}%)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Confidence Chart ─────────────────── */}
      <ConfidenceChart allScores={all_scores} predictedGenre={predicted_genre} />

      {/* ── BOTTOM: Genre Cards 5x2 Grid ─────────────── */}
      <motion.div 
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
        style={{ perspective: '1000px' }}
      >
        {sortedScores.map((scoreObj, index) => (
          <GenreCard 
            key={scoreObj.genre}
            genre={scoreObj.genre} 
            score={scoreObj.score} 
            isTop={scoreObj.genre === predicted_genre} 
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
