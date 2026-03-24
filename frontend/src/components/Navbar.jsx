/**
 * @file Navbar.jsx
 * @description Sticky navigation bar with gradient logo and GitHub link. Implements Framer Motion fade-in.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const Navbar = () => {
  const shouldReduceMotion = useReducedMotion();

  const navVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? false : 'visible'}
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[#6C63FF]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Simple music note icon */}
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="text-2xl font-[800] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6C63FF] to-[#FF6584] font-['Inter']">
              GenreAI
            </span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center space-x-6">
            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium font-['Inter'] transition-colors">
              About
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub Repository"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
          
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
