/**
 * @file HeroSection.jsx
 * @description Hero section with diagonal gradient background, staggered Framer Motion animations, and stat pills.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center bg-gradient-to-br from-[#FAFBFF] to-[#F0EEFF] min-h-[70vh] justify-center font-['Inter']">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? false : 'visible'}
        variants={containerVariants}
      >
        <motion.h1 
          className="text-[64px] font-[800] leading-tight mb-6"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <span className="block text-gray-900">Detect Music Genre</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#6C63FF] to-[#FF6584] pb-2">
            Instantly
          </span>
        </motion.h1>

        <motion.p 
          className="text-[18px] text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          An advanced machine learning pipeline leveraging a dual-head CNN and BiLSTM model 
          to classify audio tracks into distinct genres by analyzing Mel spectrograms.
        </motion.p>

        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <span className="px-6 py-2.5 rounded-full font-medium text-white shadow-sm bg-[#6C63FF]">
            10 Genres
          </span>
          <span className="px-6 py-2.5 rounded-full font-medium text-white shadow-sm bg-[#FF6584]">
            CNN + BiLSTM
          </span>
          <span className="px-6 py-2.5 rounded-full font-medium text-white shadow-sm bg-[#10B981]">
            Real-time
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
