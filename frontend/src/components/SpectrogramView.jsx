import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export default function SpectrogramView({ spectrogramData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6 w-full max-w-5xl mx-auto my-8 border border-slate-100"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800">Mel Spectrogram</h3>
          <div className="relative group cursor-help">
            <Info className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl pointer-events-none text-center">
              A mel spectrogram shows frequency content over time. The CNN reads this like an image to detect genre patterns.
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-50 rounded-lg border border-slate-100 p-4 flex flex-col items-center justify-center min-h-[300px]">
        {spectrogramData ? (
          <div className="relative w-full max-w-3xl flex flex-col items-center">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-slate-500 whitespace-nowrap">
              Mel Frequency
            </div>
            
            <img 
              src={spectrogramData.startsWith('data:') ? spectrogramData : `data:image/png;base64,${spectrogramData}`} 
              alt="Mel Spectrogram"
              className="w-full h-auto rounded shadow-sm border border-slate-200"
            />
            
            <div className="text-sm font-medium text-slate-500 mt-4">
              Time (seconds)
            </div>
          </div>
        ) : (
          <div className="text-slate-400 font-medium flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Spectrogram will appear after analysis
          </div>
        )}
      </div>
    </motion.div>
  );
}
