import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Zap, Cpu, Waves, ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { GENRE_COLORS } from '../utils/genreColors';
import { capitalizeGenre } from '../utils/formatters';

const AnimatedSection = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ type: "spring", stiffness: 60, damping: 15 }}
    className={`w-full max-w-[1200px] mx-auto px-4 py-24 ${className}`}
  >
    {children}
  </motion.section>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center flex flex-col items-center mb-16 relative">
    <h2 
      className="text-[36px] md:text-[44px] font-[800] text-gray-900 leading-tight mb-4"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {title}
    </h2>
    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-6">
      {subtitle}
    </p>
    <motion.div 
      className="h-[3px] rounded-full"
      style={{ background: 'linear-gradient(90deg, #6C63FF, #FF6584, #38F9D7)' }}
      initial={{ width: 0 }}
      whileInView={{ width: 120 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    />
  </div>
);

const HomePage = () => {
  const genres = Object.keys(GENRE_COLORS);
  
  // Duplicate array for seamless infinite marquee loop
  const marqueeGenres = [...genres, ...genres, ...genres];

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      
      {/* ── 1. Hero Section ── */}
      <HeroSection />

      {/* ── 2. Infinity Marquee ── */}
      <div className="w-full bg-white/40 backdrop-blur-md border-y border-indigo-50 py-8 overflow-hidden relative">
        {/* Left & Right fading masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F7FF] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F7FF] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee gap-8 items-center cursor-pointer">
          {marqueeGenres.map((genre, i) => (
            <div 
              key={`marquee-${genre}-${i}`}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-indigo-100/50 bg-white shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: GENRE_COLORS[genre], boxShadow: `0 0 12px ${GENRE_COLORS[genre]}` }}
              />
              <span className="font-bold tracking-wide text-gray-700 text-sm uppercase">
                {capitalizeGenre(genre)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Features Grid ── */}
      <AnimatedSection>
        <SectionHeading 
          title="Cutting-Edge Architecture" 
          subtitle="Everything from signal processing to neural network inference runs in a seamless pipeline designed for accuracy and speed."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col items-center text-center group border-t-[4px] border-t-transparent hover:border-t-[#6C63FF] transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 text-[#6C63FF]">
              <Waves size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Signal Processing</h3>
            <p className="text-gray-500 font-medium">
              We leverage <span className="text-[#6C63FF] font-semibold">Librosa</span> to instantly convert raw .WAV files into rich Mel Spectrograms, capturing nuanced time-frequency dependencies.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col items-center text-center group border-t-[4px] border-t-transparent hover:border-t-[#FF6584] transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300 text-[#FF6584]">
              <Cpu size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Hybrid Deep Learning</h3>
            <p className="text-gray-500 font-medium">
              Our <span className="text-[#FF6584] font-semibold">PyTorch</span> model uses a multi-layer CNN to extract local features, followed by a BiLSTM for temporal sequence modeling.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col items-center text-center group border-t-[4px] border-t-transparent hover:border-t-[#38F9D7] transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 text-[#38F9D7]">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Interactive Analysis</h3>
            <p className="text-gray-500 font-medium">
              Experience the results with fluid <span className="text-[#38F9D7] font-bold">Framer Motion</span> animations and dynamic 3D cards that make AI accessible and beautiful.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ── 4. Under The Hood Flowchart ── */}
      <AnimatedSection className="pt-0">
        <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-lg border border-indigo-50 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-300 rounded-full blur-[100px] opacity-30 pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-[32px] font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                How the AI <br/>Understands Music
              </h2>
              <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                Rather than listening to audio directly, our neural network "looks" at sound using visual representations called spectrograms. By combining Convolutional layers (for image patterns) and Recurrent layers (for time), the model achieves high accuracy.
              </p>
              
              <div className="flex flex-col gap-4">
                {['Trained on 1,000 GTZAN tracks', '128 Mel frequency bins', 'Real-time client-side processing API (Mock)'].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#6C63FF]" />
                    <span className="font-semibold text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Visual Mockup */}
            <div className="bg-[#F8F7FF] rounded-2xl p-6 border border-indigo-100 flex flex-col gap-4">
               {/* Audio Step */}
               <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                 <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Waves size={24}/></div>
                 <div className="flex-grow">
                   <div className="font-bold text-gray-900">1. Audio Input</div>
                   <div className="text-xs text-gray-500 font-medium">30s .WAV Sample</div>
                 </div>
               </div>

               <div className="flex justify-center -my-2 text-indigo-300 relative z-10"><ArrowRight className="rotate-90" /></div>

               {/* Spectrogram Step */}
               <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                 <div className="w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500"><Layers size={24}/></div>
                 <div className="flex-grow">
                   <div className="font-bold text-gray-900">2. Mel Spectrogram</div>
                   <div className="text-xs text-gray-500 font-medium">Feature Extraction (2D Matrix)</div>
                 </div>
               </div>

               <div className="flex justify-center -my-2 text-indigo-300 relative z-10"><ArrowRight className="rotate-90" /></div>

               {/* AI Model Step */}
               <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border-l-[4px] border-l-[#6C63FF]">
                 <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white"><Cpu size={24}/></div>
                 <div className="flex-grow">
                   <div className="font-bold text-gray-900">3. CNN + BiLSTM Inference</div>
                   <div className="text-xs text-gray-500 font-medium">Forward Pass Analysis</div>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── 5. Final CTA ── */}
      <AnimatedSection className="py-24 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-[40px] md:text-[56px] font-[900] text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to decode <br/>
            <span className="gradient-text italic">your music library?</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium mb-10 max-w-xl text-center">
            Upload any track and watch the neural network break down its DNA in real-time.
          </p>
          <Link to="/analyze">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(108, 99, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 transition-shadow duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">Start Analyzing Now</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              
              {/* Button inner gradient hover effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #6C63FF, #FF6584)' }}
              />
            </motion.button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;
