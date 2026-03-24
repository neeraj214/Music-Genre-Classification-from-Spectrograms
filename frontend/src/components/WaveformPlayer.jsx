/**
 * @file WaveformPlayer.jsx
 * @description Waveform audio player using wavesurfer.js with Framer Motion entry animations.
 */

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const WaveformPlayer = ({ audioURL, fileName }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const shouldReduceMotion = useReducedMotion();

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!audioURL || !containerRef.current) return;

    // Destroy existing instance if any
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#38F9D7',
      progressColor: '#6C63FF',
      cursorColor: '#8B5CF6',
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 80,
      normalize: true,
      url: audioURL,
    });

    ws.on('ready', () => {
      setDuration(formatTime(ws.getDuration()));
    });

    ws.on('audioprocess', () => {
      setCurrentTime(formatTime(ws.getCurrentTime()));
    });

    // Handle user interaction with waveform seeking
    ws.on('seek', () => {
        setCurrentTime(formatTime(ws.getCurrentTime()));
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [audioURL]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  if (!audioURL) return null;

  return (
    <motion.div
      className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(108,99,255,0.10)] mt-8 max-w-2xl mx-auto overflow-hidden font-['Inter'] border-t-4"
      style={{ borderTopColor: '#6C63FF' }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? {} : { type: 'spring', stiffness: 120, damping: 14 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-[800] text-gray-900 text-lg">Audio Waveform</h3>
          <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]" title={fileName}>
            {fileName || 'Unknown file'}
          </span>
        </div>

        <div ref={containerRef} className="mb-6 w-full" />

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-full text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: '#6C63FF' }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause fill="currentColor" size={20} />
            ) : (
              <Play fill="currentColor" size={20} className="ml-1" />
            )}
          </button>
          <div className="text-sm font-medium text-gray-600">
            {currentTime} <span className="text-gray-400 mx-1">/</span> {duration}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WaveformPlayer;
