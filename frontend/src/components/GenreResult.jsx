import React, { useEffect } from 'react';
import { motion, useMotionValue, animate, useTransform } from 'framer-motion';
import { GENRE_COLORS, GENRE_EMOJIS } from '../utils/genreColors';
import { capitalizeGenre } from '../utils/formatters';
import GenreCard from './GenreCard';
import ConfidenceChart from './ConfidenceChart';

const AnimatedCounter = ({ value, color }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => `${latest.toFixed(1)}%`);

  useEffect(() => {
    const target = value <= 1 ? value * 100 : value;
    const animation = animate(count, target, {
      duration: 1.5,
      ease: "easeOut"
    });
    return animation.stop;
  }, [value, count]);

  return <motion.span style={{ color }}>{rounded}</motion.span>;
};

export default function GenreResult({ result }) {
  const { predicted_genre, confidence, all_scores } = result;
  const color = GENRE_COLORS[predicted_genre] || '#94a3b8';
  const emoji = GENRE_EMOJIS[predicted_genre] || '🎵';
  const genreName = capitalizeGenre(predicted_genre);
  
  const sortedScores = [...all_scores].sort((a, b) => b.score - a.score);

  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.06
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-10 w-full max-w-5xl mx-auto my-8"
    >
      <style>
        {`
          @keyframes borderRotate {
            100% {
              transform: rotate(1turn);
            }
          }
          .hero-gradient-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 1.5rem;
            padding: 4px;
          }
          .hero-gradient-wrapper::before {
            content: '';
            position: absolute;
            top: -100%;
            left: -100%;
            width: 300%;
            height: 300%;
            background: conic-gradient(
              from 90deg,
              transparent 0%,
              ${color}40 20%,
              ${color} 50%,
              transparent 50%
            );
            animation: borderRotate 4s linear infinite;
            z-index: 0;
            transform-origin: center;
          }
          .hero-gradient-content {
            position: relative;
            z-index: 1;
            border-radius: 1.25rem;
            background-color: white;
          }
        `}
      </style>

      {/* Hero Prediction Card */}
      <motion.div variants={childVariants} className="hero-gradient-wrapper shadow-xl">
        <div className="hero-gradient-content relative flex flex-col items-center justify-center p-12 text-center">
          {/* Light Tint Background Layer */}
          <div className="absolute inset-0 rounded-[1.25rem]" style={{ backgroundColor: `${color}1A` }} />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="text-[64px] mb-4 leading-none">{emoji}</div>
            <div className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-2">
              Predicted Genre
            </div>
            <div 
              className="text-[72px] font-extrabold leading-tight mb-6"
              style={{ color }}
            >
              {genreName}
            </div>
            <div className="bg-white px-6 py-2 rounded-full shadow-sm flex items-center gap-2 border border-slate-100">
              <span className="text-slate-500 font-medium">Confidence:</span>
              <span className="font-bold text-xl">
                <AnimatedCounter value={confidence} color={color} />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Chart Component */}
      <motion.div variants={childVariants}>
        <ConfidenceChart allScores={all_scores} predictedGenre={predicted_genre} />
      </motion.div>

      {/* 5x2 grid of Genre Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {sortedScores.map((scoreObj) => (
          <motion.div key={scoreObj.genre} variants={childVariants}>
            <GenreCard 
              genre={scoreObj.genre} 
              score={scoreObj.score} 
              isTop={scoreObj.genre === predicted_genre} 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
