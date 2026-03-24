/**
 * @file UploadZone.jsx
 * @description Drag-and-drop audio upload zone with validation and an analyze button.
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, useReducedMotion } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';

const UploadZone = ({ onFileSelect, onAnalyze, file, isLoading }) => {
  const shouldReduceMotion = useReducedMotion();
  const [errorMsg, setErrorMsg] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMsg(null);
    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setErrorMsg('File size exceeds 10MB limit.');
      } else if (error.code === 'file-invalid-type') {
        setErrorMsg('Invalid file type. Please upload MP3, WAV, OGG, or FLAC.');
      } else {
        setErrorMsg(error.message || 'File upload rejected.');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'audio/flac': ['.flac']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isLoading
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    setErrorMsg(null);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const bounceTransition = shouldReduceMotion ? {} : {
    y: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(108,99,255,0.10)] p-6 max-w-2xl mx-auto font-['Inter']">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-[12px] p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[#6C63FF] bg-[#F0EEFF]' : 'border-[rgba(108,99,255,0.4)] hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <motion.div 
            className="flex justify-center mb-4 text-[#6C63FF]"
            animate={shouldReduceMotion ? false : { y: [0, -10, 0] }}
            transition={bounceTransition}
          >
            <Upload size={48} strokeWidth={1.5} />
          </motion.div>

          <p className="text-gray-900 font-[800] text-lg mb-1">
            Drop your audio file here
          </p>
          <p className="text-gray-500 mb-6 font-medium">
            or click to browse
          </p>
          
          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
            MP3 &middot; WAV &middot; OGG &middot; FLAC
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-[12px] p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-[#E5E0FF] text-[#6C63FF] p-2 rounded-lg shrink-0">
              <Upload size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-[800] text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleRemove}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 shrink-0"
            aria-label="Remove file"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-red-500 text-sm mt-4 text-center font-medium">
          {errorMsg}
        </p>
      )}

      <motion.button
        type="button"
        onClick={onAnalyze}
        disabled={!file || isLoading}
        className={`w-full mt-6 py-4 rounded-[12px] text-white font-[600] flex justify-center items-center gap-2 transition-opacity ${
          (!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ backgroundImage: 'linear-gradient(to right, #6C63FF, #8B5CF6)' }}
        whileHover={(!file || isLoading || shouldReduceMotion) ? {} : { scale: 1.02 }}
        whileTap={(!file || isLoading || shouldReduceMotion) ? {} : { scale: 0.97 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Analyzing...
          </>
        ) : (
          'Analyze Genre'
        )}
      </motion.button>
    </div>
  );
};

export default UploadZone;
