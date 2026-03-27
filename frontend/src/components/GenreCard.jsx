import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { GENRE_COLORS, GENRE_EMOJIS } from '../utils/genreColors';
import { capitalizeGenre, formatConfidence } from '../utils/formatters';

export default function GenreCard({ genre, score, isTop, index = 0 }) {
  const color = GENRE_COLORS[genre] || '#94a3b8';
  const emoji = GENRE_EMOJIS[genre] || '🎵';
  const genreName = capitalizeGenre(genre);
  const formattedScore = formatConfidence(score);
  const percentScore = score <= 1 ? score * 100 : score;
  
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Limits offset to slightly soft bounds
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;
    
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-md)',
    padding: '20px 16px',
    border: `1px solid ${color}33`, // 20% opacity using hex
    boxShadow: `0 4px 16px ${color}1A`, // 10% opacity using hex
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transformStyle: 'preserve-3d',
    width: '100%',
    height: '100%',
  };

  // Content rendering wrapper to handle "Top Pick" gradient border wrapper if needed
  const CardContent = () => (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.7, y: 20 }}
      animate={shouldReduceMotion ? false : { opacity: 1, scale: isTop ? 1.06 : 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 22,
        delay: shouldReduceMotion ? 0 : index * 0.06 
      }}
      className={isTop && !shouldReduceMotion ? "animate-pulse-glow" : ""}
      style={{
        ...cardStyle,
        ...(shouldReduceMotion ? {} : { rotateX, rotateY }),
        ...(isTop ? { boxShadow: `0 8px 32px ${color}66` } : {}), // 40% glow opacity
        zIndex: isTop ? 10 : 1
      }}
    >
      {/* ── Top Pick Badge ───────────────────────────────────── */}
      {isTop && (
        <div 
          className="absolute -top-[1px] -right-[1px]"
          style={{
            background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '0 var(--radius-md) 0 var(--radius-md)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '-2px 2px 8px rgba(108,99,255,0.3)',
            // Pop out slightly in 3D
            transform: 'translateZ(20px)'
          }}
        >
          Top Pick
        </div>
      )}

      {/* ── Emoji ────────────────────────────────────────────── */}
      <div 
        style={{ 
          fontSize: '40px', 
          marginBottom: '8px', 
          transform: 'translateZ(30px)' 
        }}
      >
        {emoji}
      </div>

      {/* ── Genre Name ───────────────────────────────────────── */}
      <div 
        className="text-slate-800"
        style={{ 
          fontWeight: 700, 
          fontSize: '15px', 
          textTransform: 'capitalize',
          marginBottom: '4px',
          transform: 'translateZ(20px)' 
        }}
      >
        {genreName}
      </div>

      {/* ── Score ────────────────────────────────────────────── */}
      <div 
        style={{ 
          color, 
          fontSize: '22px', 
          fontWeight: 800, 
          marginBottom: '16px',
          letterSpacing: '-0.02em',
          transform: 'translateZ(20px)' 
        }}
      >
        {formattedScore}
      </div>

      {/* ── Mini Progress Bar ────────────────────────────────── */}
      <div 
        style={{ 
          width: '100%', 
          height: '4px', 
          borderRadius: '2px', 
          backgroundColor: `${color}26`, // 15% hex opacity
          overflow: 'hidden',
          transform: 'translateZ(10px)'
        }}
      >
        <motion.div
          style={{ height: '100%', backgroundColor: color, borderRadius: '2px' }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentScore}%` }}
          transition={{ duration: 1, delay: shouldReduceMotion ? 0 : index * 0.06, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );

  if (isTop) {
    // Wrap top pick in gradient border
    return (
      <div className="gradient-border" style={{ perspective: '1000px', width: '100%', height: '100%' }}>
        <CardContent />
      </div>
    );
  }

  return (
    <div style={{ perspective: '1000px', width: '100%', height: '100%' }}>
      <CardContent />
    </div>
  );
}
