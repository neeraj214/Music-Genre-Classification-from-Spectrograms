/**
 * @file WaveformPlayer.jsx
 * @description Waveform audio player with dark bg, colored bars, gradient controls, volume slider.
 */

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, Volume2, Volume1, VolumeX, AudioWaveform } from 'lucide-react';

const WaveformPlayer = ({ audioURL, fileName }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const shouldReduceMotion = useReducedMotion();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!audioURL || !containerRef.current) return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#6C63FF',
      progressColor: '#38F9D7',
      cursorColor: '#FF6584',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      height: 76,
      normalize: true,
      url: audioURL,
    });

    ws.on('ready', () => {
      setDuration(ws.getDuration());
      ws.setVolume(volume);
    });

    ws.on('audioprocess', () => {
      const ct = ws.getCurrentTime();
      const dur = ws.getDuration();
      setCurrentTime(ct);
      setProgress(dur ? (ct / dur) * 100 : 0);
    });

    ws.on('seek', () => {
      const ct = ws.getCurrentTime();
      const dur = ws.getDuration();
      setCurrentTime(ct);
      setProgress(dur ? (ct / dur) * 100 : 0);
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => { setIsPlaying(false); setProgress(100); });

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioURL]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) wavesurferRef.current.playPause();
  };

  const handleProgressChange = (e) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (wavesurferRef.current && duration) {
      wavesurferRef.current.seekTo(val / 100);
      setCurrentTime((val / 100) * duration);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (wavesurferRef.current) wavesurferRef.current.setVolume(val);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!audioURL) return null;

  return (
    <motion.div
      className="glass-card gradient-border"
      style={{ marginTop: '24px', maxWidth: '640px', margin: '24px auto 0', overflow: 'hidden' }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0, scale: 1 }}
      transition={
        shouldReduceMotion
          ? {}
          : { type: 'spring', stiffness: 100, damping: 15 }
      }
    >
      <div style={{ padding: '24px' }}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AudioWaveform size={18} color="var(--brand-violet)" strokeWidth={2} />
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
              Audio Waveform
            </span>
          </div>

          {/* Filename pill */}
          {fileName && (
            <div
              className="glass-card"
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={fileName}
            >
              {fileName}
            </div>
          )}
        </div>

        {/* Gradient divider */}
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, #6C63FF, #FF6584, #38F9D7)',
            borderRadius: '1px',
            marginBottom: '16px',
          }}
        />

        {/* ── Waveform Container ───────────────────────── */}
        <div
          style={{
            background: '#0F0E17',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            marginBottom: '20px',
          }}
        >
          <div ref={containerRef} style={{ width: '100%' }} />
        </div>

        {/* ── Controls Row ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Play/Pause */}
          <motion.button
            onClick={handlePlayPause}
            whileHover={
              shouldReduceMotion
                ? {}
                : { scale: 1.1, boxShadow: '0 0 20px rgba(108,99,255,0.6)' }
            }
            whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(108,99,255,0.35)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {isPlaying
              ? <Pause fill="#fff" color="#fff" size={22} />
              : <Play  fill="#fff" color="#fff" size={22} style={{ marginLeft: 3 }} />
            }
          </motion.button>

          {/* Progress area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Time display */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Progress slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              className="wf-slider"
              aria-label="Seek"
              style={{ width: '100%' }}
            />
          </div>

          {/* Volume control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <VolumeIcon size={16} color="var(--text-muted)" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="wf-slider wf-slider--volume"
              aria-label="Volume"
              style={{ width: '80px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Slider CSS (scoped) ──────────────────────── */}
      <style>{`
        .wf-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            #6C63FF calc(var(--val, 0) * 1%),
            rgba(108,99,255,0.2) calc(var(--val, 0) * 1%)
          );
          outline: none;
          cursor: pointer;
          transition: background 0.1s;
        }
        .wf-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 3px #6C63FF, 0 2px 8px rgba(108,99,255,0.4);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .wf-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .wf-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 3px #6C63FF, 0 2px 8px rgba(108,99,255,0.4);
          cursor: pointer;
        }
        .wf-slider--volume {
          background: linear-gradient(
            90deg,
            #38F9D7 calc(var(--val, 80) * 1%),
            rgba(56,249,215,0.2) calc(var(--val, 80) * 1%)
          );
        }
      `}</style>
    </motion.div>
  );
};

export default WaveformPlayer;
