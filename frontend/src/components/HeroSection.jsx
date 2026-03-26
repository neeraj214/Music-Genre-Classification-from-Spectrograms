/**
 * @file HeroSection.jsx
 * @description Hero section with animated orbs, typewriter subheading, staggered
 * stat pills, floating genre cards, CTA buttons, and a soft scroll indicator.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ── Typewriter hook ─────────────────────────────── */
const PHRASES = [
  'Powered by CNN + BiLSTM deep learning',
  'Analyzes mel spectrograms in real-time',
  'Classifies 10 genres with 95% accuracy',
];

function useTypewriter(phrases, charDelay = 40, pauseDuration = 3000) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    if (typing) {
      if (displayed.length < phrase.length) {
        const t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), charDelay);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), pauseDuration);
        return () => clearTimeout(t);
      }
    } else {
      const t = setTimeout(() => {
        setDisplayed('');
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [displayed, typing, phraseIdx, phrases, charDelay, pauseDuration]);

  return displayed;
}

/* ── Variants ────────────────────────────────────── */
const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 12 },
  },
};

/* ── Stat pills data ─────────────────────────────── */
const PILLS = [
  {
    label: '10 Genres',
    bg: 'linear-gradient(135deg, #6C63FF, #857cf8)',
    color: '#fff',
    glow: '0 0 30px rgba(108,99,255,0.4)',
  },
  {
    label: 'CNN + BiLSTM',
    bg: 'linear-gradient(135deg, #FF6584, #ff8fab)',
    color: '#fff',
    glow: '0 0 30px rgba(255,101,132,0.4)',
  },
  {
    label: 'Real-time',
    bg: 'linear-gradient(135deg, #38F9D7, #43E97B)',
    color: '#0F0E17',
    glow: '0 0 30px rgba(56,249,215,0.4)',
  },
];

/* ── Component ───────────────────────────────────── */
const HeroSection = () => {
  const typewriterText = useTypewriter(PHRASES);

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#F8F7FF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
        paddingBottom: 80,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* ── Dot grid ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(108,99,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* ── Orb 1 — violet ── */}
      <div
        aria-hidden="true"
        className="animate-float"
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-100px',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(108,99,255,0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          animationDuration: '6s',
        }}
      />
      {/* ── Orb 2 — pink ── */}
      <div
        aria-hidden="true"
        className="animate-float"
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-80px',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(255,101,132,0.12)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          animationDuration: '8s',
          animationDelay: '2s',
        }}
      />
      {/* ── Orb 3 — cyan ── */}
      <div
        aria-hidden="true"
        className="animate-float"
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(56,249,215,0.10)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          animationDuration: '7s',
          animationDelay: '4s',
        }}
      />

      {/* ── Floating card — left (desktop) ── */}
      <motion.div
        className="glass-card animate-float hidden lg:block"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 'max(24px, calc(50% - 480px))',
          top: '38%',
          padding: '16px 20px',
          minWidth: 180,
          animationDuration: '5s',
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 22, marginBottom: 6 }}>🎷</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0E17' }}>Jazz detected</div>
        <div style={{ fontSize: 12, color: '#6E6D7A', marginBottom: 8 }}>Confidence: 94.2%</div>
        <div style={{ background: '#E5E7EB', borderRadius: 9999, height: 6, overflow: 'hidden' }}>
          <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg,#6C63FF,#FF6584)', borderRadius: 9999 }} />
        </div>
      </motion.div>

      {/* ── Floating card — right (desktop) ── */}
      <motion.div
        className="glass-card animate-float hidden lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'absolute',
          right: 'max(24px, calc(50% - 480px))',
          top: '45%',
          padding: '16px 20px',
          minWidth: 170,
          animationDuration: '7s',
          animationDelay: '1s',
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 22, marginBottom: 6 }}>🎸</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0E17' }}>Rock</div>
        <div style={{ fontSize: 12, color: '#6E6D7A', marginBottom: 8 }}>Confidence: 87.5%</div>
        <div style={{ background: '#E5E7EB', borderRadius: 9999, height: 6, overflow: 'hidden' }}>
          <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg,#FF6584,#F9A826)', borderRadius: 9999 }} />
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        style={{ position: 'relative', zIndex: 5, maxWidth: 800, textAlign: 'center', width: '100%' }}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
          <div
            className="gradient-border"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              padding: '8px 18px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 600,
              color: '#0F0E17',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#43E97B',
                display: 'inline-block',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
            ✦ AI-Powered Music Analysis
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          style={{ marginBottom: 16, lineHeight: 1.1 }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(48px, 8vw, 72px)',
              fontWeight: 800,
              color: '#0F0E17',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Detect Music Genre
          </span>
          <span
            className="gradient-text"
            style={{
              display: 'block',
              fontSize: 'clamp(48px, 8vw, 72px)',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Instantly
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          variants={itemVariants}
          style={{
            fontSize: 20,
            color: '#6E6D7A',
            marginBottom: 36,
            minHeight: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span>{typewriterText}</span>
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1.1em',
              background: '#6C63FF',
              marginLeft: 1,
              animation: 'blink-cursor 1s step-end infinite',
            }}
          />
        </motion.div>

        {/* Stat pills */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 44 }}
        >
          {PILLS.map((pill) => (
            <motion.span
              key={pill.label}
              whileHover={{ scale: 1.05, y: -2, boxShadow: pill.glow }}
              style={{
                background: pill.bg,
                color: pill.color,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 9999,
                padding: '12px 24px',
                boxShadow: pill.glow,
                cursor: 'default',
              }}
            >
              {pill.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 56 }}
        >
          {/* Primary */}
          <motion.a
            href="#upload"
            whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(108,99,255,0.5)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 9999,
              padding: '16px 36px',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
            }}
          >
            Analyze Your Music
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              style={{ display: 'flex' }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.04,
              background: 'rgba(108,99,255,0.05)',
            }}
            whileTap={{ scale: 0.96 }}
            className="gradient-border"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
              color: '#6C63FF',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 9999,
              padding: '16px 36px',
              textDecoration: 'none',
            }}
          >
            View on GitHub
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 12, color: '#A0A0B0', letterSpacing: '0.05em' }}>Scroll to explore</span>
          <ChevronDown size={18} color="#A0A0B0" className="animate-bounce-soft" />
        </motion.div>
      </motion.div>

      {/* ── Blink cursor keyframe ── */}
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
