import React, { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Upload, Activity, BarChart, ChevronDown } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import UploadZone from './components/UploadZone';
import WaveformPlayer from './components/WaveformPlayer';
import LoadingAnimation from './components/LoadingAnimation';
import GenreResult from './components/GenreResult';
import SpectrogramView from './components/SpectrogramView';

// Hooks
import { useAudioUpload } from './hooks/useAudioUpload';
import { useGenrePrediction } from './hooks/useGenrePrediction';

// Utils
import { GENRE_COLORS } from './utils/genreColors';
import { capitalizeGenre } from './utils/formatters';

// --- Shared Animated Section Wrapper ---
const AnimatedSection = ({ children, id, className = '' }) => {
  return (
    <motion.section
      id={id}
      className={`w-full max-w-[1200px] mx-auto px-4 py-[80px] ${className}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
    >
      {children}
    </motion.section>
  );
};

// --- Section Divider ---
const SectionDivider = () => (
  <div className="w-full flex justify-center">
    <div 
      className="h-[1px] w-full max-w-[1200px]"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.2) 20%, rgba(108,99,255,0.2) 80%, transparent)'
      }}
    />
  </div>
);

const App = () => {
  const { file, audioURL, handleFileSelect, handleRemove, error: uploadError } = useAudioUpload();
  const { result, isLoading, error: predictError, predict, reset } = useGenrePrediction();

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      handleFileSelect(selectedFile);
    } else {
      handleRemove();
    }
    reset();
  };

  const handleAnalyze = () => {
    if (file) predict(file);
  };

  const formattedResult = result ? {
    ...result,
    all_scores: Object.entries(result.all_scores).map(([genre, score]) => ({ genre, score }))
  } : null;

  const genres = Object.keys(GENRE_COLORS);
  
  const handleScrollToResults = () => {
    const el = document.getElementById('results');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // For the How It Works list animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200 } }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-['Inter'] text-slate-800" style={{ backgroundColor: '#F8F7FF' }}>
      
      {/* ── Background Orbs & Dots (Persisting across all app) ── */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#F8F7FF]">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(var(--border-medium) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.3
          }}
        />
        {/* Faint Orbs */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--brand-violet)' }}
        />
        <div 
          className="absolute top-[40%] right-[-10%] w-[40%] h-[50%] rounded-full blur-[120px] opacity-[0.15]"
          style={{ background: 'var(--brand-cyan)' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10"
          style={{ background: 'var(--brand-pink)' }}
        />
      </div>

      <Navbar />
      
      <main className="flex-grow flex flex-col w-full z-10">
        <HeroSection />

        <SectionDivider />

        {/* ── Upload & Analyze Section ── */}
        <AnimatedSection id="upload" className="pt-24">
          
          {/* Section Header */}
          <div className="text-center flex flex-col items-center mb-16 relative">
            <h2 
              className="text-[40px] font-[800] text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Upload & Analyze
            </h2>
            <p className="text-lg text-gray-500 font-medium mb-6">
              Drop any audio file and get instant genre prediction
            </p>
            {/* Animated Underline */}
            <motion.div 
              className="h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #6C63FF, #FF6584)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 200 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: UploadZone */}
            <div className="w-full lg:flex-[1.2]">
              <UploadZone 
                file={file} 
                onFileSelect={handleFileChange} 
                onAnalyze={handleAnalyze} 
                isLoading={isLoading} 
              />
              {uploadError && <p className="text-red-500 text-center mt-4 font-medium">{uploadError}</p>}
              {predictError && <p className="text-red-500 text-center mt-4 font-medium">{predictError}</p>}
            </div>

            {/* Right: How it Works */}
            <div className="w-full lg:flex-[0.8]">
              <div className="glass-card p-8 h-full flex flex-col relative overflow-hidden">
                <h3 className="text-[20px] font-[700] text-gray-900 mb-8 z-10">How it works</h3>
                
                <motion.div 
                  className="space-y-6 mb-10 flex-grow z-10 relative"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Left animated border track connecting steps */}
                  <div className="absolute left-[17px] top-[20px] bottom-[20px] w-[2px] bg-indigo-100 z-[-1]" />

                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <motion.div variants={itemVariants} className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      1
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <Upload size={16} className="text-[#6C63FF]" /> Upload your audio
                      </h4>
                      <p className="text-sm font-medium text-gray-500">MP3, WAV, OGG, FLAC supported</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <motion.div variants={itemVariants} className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      2
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <Activity size={16} className="text-[#6C63FF]" /> AI analyzes patterns
                      </h4>
                      <p className="text-sm font-medium text-gray-500">Mel spectrogram + CNN features</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <motion.div variants={itemVariants} className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      3
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <BarChart size={16} className="text-[#6C63FF]" /> Get your result
                      </h4>
                      <p className="text-sm font-medium text-gray-500">Genre + full confidence breakdown</p>
                    </div>
                  </div>
                </motion.div>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-[8px] z-10 pt-6 border-t border-indigo-50/50">
                  {genres.map((genre) => (
                    <motion.span 
                      key={genre}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="px-[14px] py-[6px] text-[12px] font-[600] rounded-full shadow-sm cursor-default"
                      style={{ 
                        color: GENRE_COLORS[genre], 
                        backgroundColor: `${GENRE_COLORS[genre]}1F` // ~12% opacity
                      }}
                    >
                      {capitalizeGenre(genre)}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {audioURL && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="w-full mt-8"
              >
                <WaveformPlayer key="waveform" audioURL={audioURL} fileName={file?.name} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll to results indicator */}
          <AnimatePresence>
            {formattedResult && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center mt-12"
              >
                <button 
                  onClick={handleScrollToResults}
                  className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#6C63FF] transition-colors"
                >
                  <span className="text-sm font-bold tracking-wider uppercase bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-200">
                    Results Below
                  </span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>
        
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading-container" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full"
            >
              <SectionDivider />
              <AnimatedSection id="loading-sec" className="py-20 flex justify-center">
                <LoadingAnimation key="loading" />
              </AnimatedSection>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {formattedResult && !isLoading && (
            <motion.div 
              key="results-container" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full"
            >
              <SectionDivider />
              <AnimatedSection id="results" className="pb-32">
                <div className="flex flex-col gap-12 w-full">
                  <GenreResult key="genre-result" result={formattedResult} />
                  
                  {formattedResult.spectrogram && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }}
                    >
                      <SpectrogramView key="spectrogram" spectrogramData={formattedResult.spectrogram} />
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
};

export default App;
