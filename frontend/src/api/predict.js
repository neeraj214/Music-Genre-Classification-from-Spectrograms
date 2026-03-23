/**
 * @fileoverview Axios client for the Music Genre Classification prediction API.
 */

import axios from 'axios'

/** Base URL for the backend API. Falls back to localhost:8000 in development. */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000, // 60 s — audio processing can take a moment
})

/**
 * @typedef {Object} PredictionResult
 * @property {string} predicted_genre - The top predicted genre slug (e.g. "jazz").
 * @property {number} confidence      - Confidence of the top prediction (0–1).
 * @property {Record<string, number>} all_scores - Confidence scores for every genre.
 */

/**
 * Sends an audio file to the backend for genre classification.
 *
 * @param {File} audioFile - The audio file selected by the user.
 * @param {(pct: number) => void} [onUploadProgress] - Optional upload-progress callback (0–100).
 * @returns {Promise<PredictionResult>} The classification result from the API.
 * @throws {Error} A descriptive error if the request fails or the server returns a non-2xx status.
 */
export async function predictGenre(audioFile, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', audioFile)

  try {
    const response = await apiClient.post('/api/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0
            onUploadProgress(pct)
          }
        : undefined,
    })

    const { predicted_genre, confidence, all_scores } = response.data

    if (!predicted_genre) {
      throw new Error('Server returned an unexpected response format.')
    }

    return { predicted_genre, confidence, all_scores }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const detail = error.response?.data?.detail ?? error.message

      if (status === 422) {
        throw new Error(`Invalid file format — please upload a supported audio file. (${detail})`)
      }
      if (status === 413) {
        throw new Error('File is too large. Please upload an audio file under 50 MB.')
      }
      if (status === 503 || !error.response) {
        throw new Error('Cannot reach the classification server. Please ensure the backend is running.')
      }
      throw new Error(`Prediction failed (${status ?? 'network error'}): ${detail}`)
    }

    // Re-throw non-Axios errors unchanged
    throw error
  }
}
