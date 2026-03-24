import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import UploadZone from './components/UploadZone';
import WaveformPlayer from './components/WaveformPlayer';

import { useAudioUpload } from './hooks/useAudioUpload';
import { useGenrePrediction } from './hooks/useGenrePrediction';

const App = () => {
  const { file, audioURL, handleFileSelect, handleRemove, error: uploadError } = useAudioUpload();
  const { result, isLoading, error: predictError, predict, reset } = useGenrePrediction();

  const onFileChange = (newFile) => {
    if (newFile) {
      handleFileSelect(newFile);
    } else {
      handleRemove();
    }
    reset(); // Clear previous predictions when file changes
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] font-['Inter']">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Upload and Player Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 -mt-10" id="upload-section">
            <UploadZone 
              file={file} 
              onFileSelect={onFileChange} 
              onAnalyze={() => predict(file)} 
              isLoading={isLoading} 
            />

            {uploadError && <p className="text-red-500 text-center mt-4 font-medium">{uploadError}</p>}
            {predictError && <p className="text-red-500 text-center mt-4 font-medium">{predictError}</p>}

            {audioURL && (
              <WaveformPlayer audioURL={audioURL} fileName={file?.name} />
            )}

            {/* Prediction Results */}
            {result && (
              <div className="mt-8 max-w-2xl mx-auto bg-white p-8 rounded-[16px] shadow-[0_4px_24px_rgba(108,99,255,0.10)] border-t-4" style={{ borderColor: '#FF6584' }}>
                 <h2 className="text-2xl font-[800] mb-6 text-center text-gray-900">Analysis Result</h2>
                 
                 <div className="flex justify-center items-baseline gap-3 mb-8">
                   <span className="text-5xl capitalize font-[800] bg-clip-text text-transparent bg-gradient-to-r from-[#6C63FF] to-[#FF6584]">
                     {result.predicted_genre}
                   </span>
                   <span className="text-xl text-gray-400 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                 </div>
                 
                 <div className="space-y-4">
                   <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">Confidence Scores</h3>
                   {Object.entries(result.all_scores)
                     .sort(([,a], [,b]) => b - a)
                     .map(([genre, score]) => (
                     <div key={genre} className="flex items-center">
                       <span className="w-24 capitalize text-gray-600 font-medium text-sm">{genre}</span>
                       <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden ml-4">
                         <div 
                           className="h-full rounded-full transition-all duration-1000 ease-out" 
                           style={{ 
                             width: `${score * 100}%`,
                             backgroundColor: genre === result.predicted_genre ? '#FF6584' : '#6C63FF'
                           }}
                         />
                       </div>
                       <span className="w-16 text-right text-xs text-gray-500 font-medium ml-4">{(score * 100).toFixed(1)}%</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
