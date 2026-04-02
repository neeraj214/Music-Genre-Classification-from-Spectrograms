import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const techPills = ['PyTorch', 'librosa', 'React', 'Framer Motion', 'Recharts'];
  const links = ['GitHub', 'Documentation', 'About'];

  return (
    <footer 
      className="relative text-white py-[60px] px-6 font-['Inter']"
      style={{
        background: 'linear-gradient(135deg, #0F0E17 0%, #1a1830 100%)',
        zIndex: 10
      }}
    >
      <style>{`
        .hover-gradient-link:hover {
          background: linear-gradient(135deg, #6C63FF 0%, #FF6584 50%, #38F9D7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      {/* Animated gradient accent line at the top */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] animate-gradient"
        style={{
          background: 'linear-gradient(90deg, #6C63FF, #FF6584, #38F9D7, #6C63FF)',
          backgroundSize: '300% 100%'
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Logo and Tagline */}
        <div className="mb-10">
          <div className="text-3xl font-[900] tracking-tight mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Genre<span style={{ color: '#6C63FF' }}>AI</span>
          </div>
          <p className="text-white/60 font-medium text-sm">AI-powered music genre classification</p>
        </div>

        {/* Divider */}
        <div 
          className="w-1/2 h-[1px] mb-10"
          style={{ background: 'linear-gradient(90deg, transparent, #6C63FF, #FF6584, #38F9D7, transparent)' }}
        />

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {techPills.map((tech) => (
            <motion.span 
              key={tech}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 text-white/80 transition-colors"
              style={{ backgroundColor: 'transparent', cursor: 'default' }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Links row */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 text-sm font-bold tracking-wide">
          {links.map((link) => (
            <a
              key={link}
              href={link === 'GitHub' ? "https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms" : "#"}
              target={link === 'GitHub' ? "_blank" : undefined}
              rel={link === 'GitHub' ? "noopener noreferrer" : undefined}
              className="text-white hover-gradient-link transition-all duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/80 font-semibold text-sm">
            Built with CNN + BiLSTM &middot; Made by neeraj214
          </p>
          <p className="text-white/40 text-xs font-medium tracking-wide border-t border-white/10 pt-4 mt-2 w-48 text-center">
            &copy; {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
