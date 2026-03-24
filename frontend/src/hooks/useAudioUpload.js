import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing audio file uploads with validation.
 * @returns {Object} State and handler functions for audio upload
 * @property {File|null} file - The selected audio file
 * @property {string|null} audioURL - Object URL for the selected file
 * @property {Function} handleFileSelect - Function to handle file selection
 * @property {Function} handleRemove - Function to remove the selected file
 * @property {string|null} error - Error message if validation fails
 */
export const useAudioUpload = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);

  const VALID_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/x-m4a'];
  const VALID_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Validates and processes the selected file.
   * @param {File} selectedFile - The file to process
   */
  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);

    if (!selectedFile) {
      return;
    }

    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    
    // Validate file type
    if (!VALID_TYPES.includes(selectedFile.type) && !VALID_EXTENSIONS.includes(fileExtension)) {
      setError('Invalid file type. Please upload .mp3, .wav, .ogg, or .flac files.');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_SIZE) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    // Clean up previous URL
    setAudioURL((prevURL) => {
      if (prevURL) {
        URL.revokeObjectURL(prevURL);
      }
      return URL.createObjectURL(selectedFile);
    });
    setFile(selectedFile);
  }, []);

  /**
   * Removes the currently selected file and cleans up its object URL.
   */
  const handleRemove = useCallback(() => {
    setAudioURL((prevURL) => {
      if (prevURL) {
        URL.revokeObjectURL(prevURL);
      }
      return null;
    });
    setFile(null);
    setError(null);
  }, []);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return { file, audioURL, handleFileSelect, handleRemove, error };
};
