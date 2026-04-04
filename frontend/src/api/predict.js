import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
});

export async function predictGenre(audioFile, onUploadProgress, retryCount = 0) {
  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await apiClient.post('/api/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(pct);
          }
        : undefined,
    });

    const data = response.data;
    if (!data.predicted_genre) {
      throw new Error('Server returned an unexpected response format.');
    }

    return {
      predicted_genre: data.predicted_genre,
      confidence: data.confidence,
      all_scores: data.all_scores,
      spectrogram: data.spectrogram,
      processing_time_ms: data.processing_time_ms,
      model_version: data.model_version
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status) {
        if (status === 422) {
          throw new Error('Unsupported file type. Use MP3, WAV, OGG, or FLAC.');
        }
        if (status === 413) {
          throw new Error('File too large. Please use a file under 10MB.');
        }
        if (status === 503) {
          throw new Error('Model not trained yet. Run python src/train.py first.');
        }
        if (status >= 500) {
          throw new Error('Server error. Check the backend logs.');
        }
      } else {
        // Network error (no status code).
        if (retryCount < 1) {
          return predictGenre(audioFile, onUploadProgress, retryCount + 1);
        }
        throw new Error('Cannot reach the classification server. Please ensure the backend is running.');
      }
    }
    throw error;
  }
}
