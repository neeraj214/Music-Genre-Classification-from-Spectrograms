import { useState, useCallback } from 'react';
import { predictGenre } from '../api/predict';

const MOCK_MODE = false;

/**
 * Custom hook for managing genre prediction.
 * @returns {Object} State and handler functions for genre prediction
 * @property {Object|null} result - The prediction result containing predicted_genre, confidence, and all_scores
 * @property {boolean} isLoading - Loading state during prediction
 * @property {string|null} error - Error message if prediction fails
 * @property {Function} predict - Function to trigger the prediction with an audio file
 * @property {Function} reset - Function to reset the prediction state
 */
export const useGenrePrediction = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Triggers the prediction for a given audio file.
   * @param {File} file - The audio file to predict the genre for
   */
  const predict = useCallback(async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    if (MOCK_MODE) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setResult({
          predicted_genre: "jazz",
          confidence: 0.912,
          all_scores: {
            blues: 0.031,
            classical: 0.012,
            country: 0.008,
            disco: 0.015,
            hiphop: 0.007,
            jazz: 0.912,
            metal: 0.003,
            pop: 0.006,
            reggae: 0.004,
            rock: 0.002
          }
        });
      } catch (err) {
        setError('An error occurred during mock prediction.');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await predictGenre(file);
        setResult(response);
      } catch (err) {
        setError(err.message || 'An error occurred during prediction.');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Resets the prediction state.
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, predict, reset };
};
