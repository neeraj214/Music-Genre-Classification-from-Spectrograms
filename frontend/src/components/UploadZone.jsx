/**
 * @file UploadZone.jsx
 * @description Drag-and-drop audio upload zone with glow, ripple, and gradient animations.
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';

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
      'audio/flac': ['.flac'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isLoading,
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

  const isDisabled = !file || isLoading;

  return (
    <div
      className="glass-card gradient-border"
      style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', transition: 'all 0.3s ease' }}
    >
      {/* ── Drop Area ─────────────────────────────────── */}
      <motion.div
        {...getRootProps()}
        whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
        style={{
          border: isDragActive
            ? '2px solid rgba(108,99,255,0.7)'
            : '2px dashed rgba(108,99,255,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '48px 32px',
          background: isDragActive ? 'rgba(108,99,255,0.06)' : 'rgba(108,99,255,0.02)',
          textAlign: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          transition: 'all 0.3s ease',
          position: 'relative',
          boxShadow: isDragActive ? '0 0 0 4px rgba(108,99,255,0.15)' : 'none',
        }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Upload icon with ripple */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                {/* Ripple rings */}
                {!shouldReduceMotion && (
                  <>
                    <span className="upload-ripple" style={{ animationDelay: '0s' }} />
                    <span className="upload-ripple" style={{ animationDelay: '0.6s' }} />
                  </>
                )}
                {/* Icon circle */}
                <div
                  className="animate-bounce-soft"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Upload size={32} color="#fff" strokeWidth={2} />
                </div>
              </div>

              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Drop your audio file here
              </p>
              <p
                style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', cursor: 'pointer' }}
                className="browse-link"
              >
                or click to browse
              </p>

              {/* Format badge */}
              <div
                className="glass-card"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span style={{ color: '#6C63FF' }}>MP3</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: '#FF6584' }}>WAV</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: '#38F9D7' }}>OGG</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: '#F9A826' }}>FLAC</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                }}
              >
                <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
              </motion.div>

              {/* Filename */}
              <p
                className="gradient-text"
                style={{
                  fontWeight: 700,
                  fontSize: '16px',
                  maxWidth: '320px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={file.name}
              >
                {file.name}
              </p>

              {/* File size */}
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {formatSize(file.size)}
              </p>

              {/* Remove button */}
              <motion.button
                type="button"
                onClick={handleRemove}
                disabled={isLoading}
                whileHover={shouldReduceMotion ? {} : { backgroundColor: 'rgba(239,68,68,0.15)' }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                aria-label="Remove file"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(239,68,68,0.25)',
                  background: 'transparent',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: '#ef4444',
                  transition: 'background 0.2s',
                  marginTop: '4px',
                }}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Error Message ──────────────────────────────── */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: [0, 10, -10, 10, -10, 0] }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '14px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <X size={14} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Analyze Button ─────────────────────────────── */}
      <motion.button
        type="button"
        onClick={onAnalyze}
        disabled={isDisabled}
        whileHover={
          isDisabled || shouldReduceMotion
            ? {}
            : { scale: 1.02, boxShadow: '0 8px 32px rgba(108,99,255,0.4)' }
        }
        whileTap={isDisabled || shouldReduceMotion ? {} : { scale: 0.97 }}
        className={isLoading ? 'btn-analyze btn-analyze--loading' : 'btn-analyze'}
        style={{
          width: '100%',
          height: '56px',
          marginTop: '20px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: isDisabled
            ? 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)'
            : 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
          backgroundSize: '200% auto',
          color: '#fff',
          fontWeight: 700,
          fontSize: '16px',
          letterSpacing: '0.02em',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.4 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background-position 0.4s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Shimmer overlay during loading */}
        {isLoading && (
          <span
            className="animate-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          />
        )}

        {isLoading ? (
          <>
            <Loader2
              size={20}
              color="#fff"
              style={{
                animation: 'spin-slow 0.8s linear infinite',
                flexShrink: 0,
              }}
            />
            <span>Analyzing...</span>
          </>
        ) : (
          'Analyze Genre'
        )}
      </motion.button>

      {/* ── Ripple CSS (scoped) ────────────────────────── */}
      <style>{`
        .upload-ripple {
          position: absolute;
          top: 0; left: 0;
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 2px solid rgba(108,99,255,0.5);
          animation: ripple 2s ease-out infinite;
          pointer-events: none;
        }
        .browse-link:hover { text-decoration: underline; }
        .btn-analyze:not(:disabled):hover { background-position: right center; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UploadZone;
