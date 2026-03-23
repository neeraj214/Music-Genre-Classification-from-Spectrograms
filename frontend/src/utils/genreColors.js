/**
 * @fileoverview Genre metadata maps used throughout the UI.
 * Use these constants — never hardcode genre names in components.
 */

/**
 * Maps each genre name to its brand hex color.
 * @type {Record<string, string>}
 */
export const GENRE_COLORS = {
  blues:      '#3B82F6',
  classical:  '#8B5CF6',
  country:    '#F59E0B',
  disco:      '#EC4899',
  hiphop:     '#10B981',
  jazz:       '#F97316',
  metal:      '#EF4444',
  pop:        '#06B6D4',
  reggae:     '#84CC16',
  rock:       '#6366F1',
}

/**
 * Maps each genre name to a representative emoji.
 * @type {Record<string, string>}
 */
export const GENRE_EMOJIS = {
  blues:      '🎸',
  classical:  '🎻',
  country:    '🤠',
  disco:      '🪩',
  hiphop:     '🎤',
  jazz:       '🎷',
  metal:      '🤘',
  pop:        '🎵',
  reggae:     '🌿',
  rock:       '🎸',
}

/**
 * Maps each genre to a short one-line description.
 * @type {Record<string, string>}
 */
export const GENRE_DESCRIPTIONS = {
  blues:      'Soulful and expressive, rooted in African-American musical traditions.',
  classical:  'Orchestral compositions spanning baroque, romantic, and modern eras.',
  country:    'Storytelling ballads and folk melodies from the American South.',
  disco:      'High-energy dance music defined by four-on-the-floor beats and funky bass.',
  hiphop:     'Rhythmic rhymes over sampled beats — born in the Bronx, heard worldwide.',
  jazz:       'Improvisation-driven harmonies blending swing, bebop, and blues.',
  metal:      'Heavy, distorted guitar riffs with powerful drums and intense vocals.',
  pop:        'Catchy hooks and polished production made for the mainstream crowd.',
  reggae:     'Laid-back Jamaican rhythms rooted in love, unity, and resistance.',
  rock:       'Guitar-driven energy spanning everything from classic to alternative.',
}
