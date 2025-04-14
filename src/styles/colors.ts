/**
 * Company brand colors
 */
export const COLORS = {
  // Primary brand colors
  GREEN: '#5d992a',
  YELLOW: '#e5b546',
  BLUE: '#3cb1dc',
  PINK: '#d45484',

  // Variants with opacity
  GREEN_LIGHT: 'rgba(93, 153, 42, 0.1)',
  YELLOW_LIGHT: 'rgba(229, 181, 70, 0.1)',
  BLUE_LIGHT: 'rgba(60, 177, 220, 0.1)',
  PINK_LIGHT: 'rgba(212, 84, 132, 0.1)',

  GREEN_MEDIUM: 'rgba(93, 153, 42, 0.5)',
  YELLOW_MEDIUM: 'rgba(229, 181, 70, 0.5)',
  BLUE_MEDIUM: 'rgba(60, 177, 220, 0.5)',
  PINK_MEDIUM: 'rgba(212, 84, 132, 0.5)',

  // Text colors on brand colors
  ON_GREEN: '#ffffff',
  ON_YELLOW: '#000000',
  ON_BLUE: '#ffffff',
  ON_PINK: '#ffffff',
}

/**
 * Tailwind CSS compatible color values
 */
export const TAILWIND_COLORS = {
  green: '#5d992a',
  yellow: '#e5b546',
  blue: '#3cb1dc',
  pink: '#d45484',
  
  'green-light': 'rgba(93, 153, 42, 0.1)',
  'yellow-light': 'rgba(229, 181, 70, 0.1)',
  'blue-light': 'rgba(60, 177, 220, 0.1)',
  'pink-light': 'rgba(212, 84, 132, 0.1)',
}

/**
 * Semantic color mapping
 */
export const SEMANTIC_COLORS = {
  primary: COLORS.GREEN,
  secondary: COLORS.YELLOW,
  accent: COLORS.BLUE,
  highlight: COLORS.PINK,
  success: COLORS.GREEN,
  info: COLORS.BLUE,
  warning: COLORS.YELLOW,
  error: COLORS.PINK,
} 