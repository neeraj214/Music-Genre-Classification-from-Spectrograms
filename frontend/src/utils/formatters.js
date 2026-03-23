/**
 * @fileoverview Formatting utilities for display values across the UI.
 */

/**
 * Formats a confidence score (0–1 or 0–100) as a percentage string.
 * @param {number} score - Confidence value (0–1 or 0–100).
 * @returns {string} Formatted percentage, e.g. "94.2%".
 */
export function formatConfidence(score) {
  const pct = score <= 1 ? score * 100 : score
  return `${pct.toFixed(1)}%`
}

/**
 * Formats a duration in seconds to mm:ss format.
 * @param {number} seconds - Duration in seconds.
 * @returns {string} Formatted duration, e.g. "2:34".
 */
export function formatDuration(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number} bytes - File size in bytes.
 * @returns {string} Formatted size, e.g. "3.2 MB".
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Capitalises a genre slug for display.
 * Special-cases "hiphop" → "Hip-Hop".
 * @param {string} name - Genre slug (e.g. "hiphop", "classical").
 * @returns {string} Display name, e.g. "Hip-Hop", "Classical".
 */
export function capitalizeGenre(name) {
  if (!name) return ''
  if (name.toLowerCase() === 'hiphop') return 'Hip-Hop'
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}
