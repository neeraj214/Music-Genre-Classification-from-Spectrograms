import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

/* ── Stat pills data ─────────────────────────────── */
const PILLS = [
  {
    label: '10 Genres',
    color: '#6C63FF',
  },
  {
    label: 'CNN + BiLSTM',
    color: '#FF6584',
  },
  {
    label: 'Real-time',
    color: '#43E97B',
  },
];

/* ── Component ───────────────────────────────────── */
const HeroSection = () => {
  const typewriterText = useTypewriter(PHRASES);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-150px',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(108,99,255,0.5)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-100px',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,101,132,0.5)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(56,249,215,0.5)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Dot grid pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(108,99,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Custom Styles */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 220px 1fr 220px;
          gap: 32px;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 24px 60px;
          width: 100%;
          flex-grow: 1;
        }
        .hero-heading {
          font-size: 56px;
          font-weight: 800;
          color: #0F0E17;
          line-height: 1.1;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 0px;
        }
        .hero-heading-gradient {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          font-family: 'Space Grotesk', sans-serif;
          display: block;
        }
        .marquee-strip {
          white-space: nowrap;
          animation: marquee-scroll 25s linear infinite;
          display: inline-block;
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .floating-card-wrapper {
            display: none !important;
          }
          .hero-heading, .hero-heading-gradient {
            font-size: 40px;
          }
        }
        @media (max-width: 768px) {
          .hero-heading, .hero-heading-gradient {
            font-size: 32px;
          }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .animate-gradient {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 3-column grid */}
      <div className="hero-grid">
        
        {/* Left card column */}
        <div className="floating-card-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 10 }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.4 },
              x: { duration: 0.6, delay: 0.4 },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            }}
            viewport={{ once: true }}
            style={{
              width: 200,
              padding: 20,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(108,99,255,0.15)',
              boxShadow: '0 8px 32px rgba(108,99,255,0.12)',
              marginLeft: 'auto',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>🎷</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F0E17' }}>Jazz detected</div>
            <div style={{ fontSize: 12, color: '#6E6D7A', marginTop: 2 }}>Confidence: 94.2%</div>
            <div style={{ background: 'rgba(108,99,255,0.15)', borderRadius: 2, height: 4, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ width: '94.2%', height: '100%', background: 'linear-gradient(90deg, #6C63FF, #8B5CF6)', borderRadius: 2 }} />
            </div>
          </motion.div>
        </div>

        {/* Center content column */}
        <div style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
          {/* Badge */}
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
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
          </div>

          {/* GlowRing */}
          <div
            className="animate-gradient"
            style={{
              position: 'absolute',
              width: 300,
              height: 120,
              background: 'linear-gradient(135deg, #6C63FF20, #FF658420)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Heading */}
          <h1 style={{ position: 'relative', zIndex: 1 }}>
            <span className="hero-heading">Detect Music Genre</span>
            <span className="gradient-text hero-heading-gradient">Instantly</span>
          </h1>

          {/* Typewriter text */}
          <div
            style={{
              fontSize: 17,
              color: '#6E6D7A',
              margin: '20px 0',
              minHeight: 28,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              zIndex: 10,
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
          </div>

          {/* Stat pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              margin: '24px 0',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {PILLS.map((pill) => (
              <motion.span
                key={pill.label}
                whileHover={{ scale: 1.05, y: -3 }}
                style={{
                  background: '#fff',
                  color: pill.color,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 9999,
                  padding: '10px 20px',
                  border: `1.5px solid ${pill.color}`,
                  boxShadow: `0 4px 12px ${pill.color}33`, // 0.2 opacity approx
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: pill.color,
                    display: 'inline-block',
                  }}
                />
                {pill.label}
              </motion.span>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              marginTop: 32,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <motion.a
              href="/analyze"
              whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(108,99,255,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="animate-shimmer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                backgroundSize: '200% 100%',
                color: '#fff',
                fontWeight: 700,
                fontSize: 17,
                borderRadius: 9999,
                padding: '16px 36px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                minWidth: '220px',
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
                justifyContent: 'center',
                gap: 10,
                background: '#fff',
                color: '#6C63FF',
                fontWeight: 700,
                fontSize: 17,
                borderRadius: 9999,
                padding: '16px 36px',
                textDecoration: 'none',
                minWidth: '220px',
              }}
            >
              View on GitHub
            </motion.a>
          </div>

          {/* Scroll / Live model indicator */}
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            {/* Live Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#43E97B',
                  borderRadius: '50%',
                  animation: 'pulse-glow 2s infinite',
                }}
              />
              <span style={{ fontSize: 12, color: '#43E97B', fontWeight: 600 }}>Live AI model</span>
            </div>
            
            <ChevronDown size={18} color="#A0A0B0" className="animate-bounce" style={{ marginTop: 4 }} />
          </div>
        </div>

        {/* Right card column */}
        <div className="floating-card-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', zIndex: 10 }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            animate={{ y: [0, -16, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.6 },
              x: { duration: 0.6, delay: 0.6 },
              y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }
            }}
            viewport={{ once: true }}
            style={{
              width: 200,
              padding: 20,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(108,99,255,0.15)',
              boxShadow: '0 8px 32px rgba(108,99,255,0.12)',
              marginRight: 'auto',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>🎸</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F0E17' }}>Rock</div>
            <div style={{ fontSize: 12, color: '#6E6D7A', marginTop: 2 }}>Confidence: 87.5%</div>
            <div style={{ background: 'rgba(108,99,255,0.15)', borderRadius: 2, height: 4, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ width: '87.5%', height: '100%', background: 'linear-gradient(90deg, #FF6584, #F97316)', borderRadius: 2 }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee strip */}
      <div 
        style={{
          width: '100%',
          overflow: 'hidden',
          background: '#fff',
          borderTop: '1px solid rgba(108,99,255,0.1)',
          borderBottom: '1px solid rgba(108,99,255,0.1)',
          padding: '14px 0',
          marginTop: 'auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div 
          style={{ whiteSpace: 'nowrap', display: 'flex' }}
        >
          <div className="marquee-strip">
            <span style={{ fontSize: 14, fontWeight: 500, color: '#6E6D7A', paddingRight: '20px' }}>
              🎸 Rock  ·  🎷 Jazz  ·  🎻 Classical  ·  🤠 Country  ·  🎤 Hip-Hop  ·  🪩 Disco  ·  🤘 Metal  ·  🎵 Pop  ·  🌿 Reggae  ·  🎸 Blues  ·
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#6E6D7A', paddingRight: '20px' }}>
              🎸 Rock  ·  🎷 Jazz  ·  🎻 Classical  ·  🤠 Country  ·  🎤 Hip-Hop  ·  🪩 Disco  ·  🤘 Metal  ·  🎵 Pop  ·  🌿 Reggae  ·  🎸 Blues  ·
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#6E6D7A', paddingRight: '20px' }}>
              🎸 Rock  ·  🎷 Jazz  ·  🎻 Classical  ·  🤠 Country  ·  🎤 Hip-Hop  ·  🪩 Disco  ·  🤘 Metal  ·  🎵 Pop  ·  🌿 Reggae  ·  🎸 Blues  ·
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#6E6D7A', paddingRight: '20px' }}>
              🎸 Rock  ·  🎷 Jazz  ·  🎻 Classical  ·  🤠 Country  ·  🎤 Hip-Hop  ·  🪩 Disco  ·  🤘 Metal  ·  🎵 Pop  ·  🌿 Reggae  ·  🎸 Blues  ·
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
