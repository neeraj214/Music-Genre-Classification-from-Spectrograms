import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Upload, Activity, BarChart } from 'lucide-react';

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

const App = () => {
  const { file, audioURL, handleFileSelect, handleRemove, error: uploadError } = useAudioUpload();
  const { result, isLoading, error: predictError, predict, reset } = useGenrePrediction();

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      handleFileSelect(selectedFile);
    } else {
      handleRemove();
    }
    reset(); // reset prediction when file changes
  };

  const handleAnalyze = () => {
    if (file) {
      predict(file);
    }
  };

  // Convert all_scores object to array for GenreResult if result exists
  const formattedResult = result ? {
    ...result,
    all_scores: Object.entries(result.all_scores).map(([genre, score]) => ({ genre, score }))
  } : null;

  const genres = Object.keys(GENRE_COLORS);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] font-['Inter'] text-slate-800">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center w-full">
        <HeroSection />
        
        {/* Main Content Area */}
        <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col gap-8 -mt-10 relative z-10 pb-16">
          
          {/* Top Section: Upload vs How It Works */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Upload */}
            <div className="w-full">
              <UploadZone 
                file={file} 
                onFileSelect={handleFileChange} 
                onAnalyze={handleAnalyze} 
                isLoading={isLoading} 
              />
              {uploadError && <p className="text-red-500 text-center mt-4 font-medium">{uploadError}</p>}
              {predictError && <p className="text-red-500 text-center mt-4 font-medium">{predictError}</p>}
            </div>

            {/* Right Column: How it Works static card */}
            <div className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-8 w-full h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-800">How it works</h3>
                <ul className="space-y-5 mb-8">
                  <li className="flex items-center gap-4 text-slate-600 font-medium">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Upload size={20} />
                    </div>
                    <span>Upload your audio file</span>
                  </li>
                  <li className="flex items-center gap-4 text-slate-600 font-medium">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Activity size={20} />
                    </div>
                    <span>AI reads the mel spectrogram</span>
                  </li>
                  <li className="flex items-center gap-4 text-slate-600 font-medium">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <BarChart size={20} />
                    </div>
                    <span>Get genre + confidence scores</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span 
                      key={genre}
                      className="px-3 py-1 text-sm font-semibold rounded-full"
                      style={{ 
                        color: GENRE_COLORS[genre], 
                        backgroundColor: `${GENRE_COLORS[genre]}26` // ~15% opacity hex
                      }}
                    >
                      {capitalizeGenre(genre)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Components managed by AnimatePresence */}
          <div className="flex flex-col gap-8 w-full items-center">
            <AnimatePresence mode="wait">
              {audioURL && <WaveformPlayer key="waveform" audioURL={audioURL} fileName={file?.name} />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isLoading && <LoadingAnimation key="loading" />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {formattedResult && !isLoading && <GenreResult key="genre-result" result={formattedResult} />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {formattedResult && !isLoading && <SpectrogramView key="spectrogram" spectrogramData={formattedResult?.spectrogram || null} />}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
