/**
 * Company brand colors
 */
export const COLORS = {
  // Primary brand colors
  YELLOW: 'rgb(247, 203, 87)',
  PINK: 'rgb(237, 109, 148)',
  BLUE: 'rgb(90, 202, 244)',
  GREEN: '#5d992a',

  // Variants with opacity
  YELLOW_LIGHT: 'rgba(247, 203, 87, 0.1)',
  PINK_LIGHT: 'rgba(237, 109, 148, 0.1)',
  BLUE_LIGHT: 'rgba(90, 202, 244, 0.1)',
  GREEN_LIGHT: 'rgba(93, 153, 42, 0.1)',

  YELLOW_MEDIUM: 'rgba(247, 203, 87, 0.5)',
  PINK_MEDIUM: 'rgba(237, 109, 148, 0.5)',
  BLUE_MEDIUM: 'rgba(90, 202, 244, 0.5)',
  GREEN_MEDIUM: 'rgba(93, 153, 42, 0.5)',

  // Text colors on brand colors
  ON_YELLOW: '#000000',
  ON_PINK: '#ffffff',
  ON_BLUE: '#ffffff',
  ON_GREEN: '#ffffff',
}

/**
 * Tailwind CSS compatible color values
 */
export const TAILWIND_COLORS = {
  yellow: 'rgb(247, 203, 87)',
  pink: 'rgb(237, 109, 148)',
  blue: 'rgb(90, 202, 244)',
  green: '#5d992a',
  
  'yellow-light': 'rgba(247, 203, 87, 0.1)',
  'pink-light': 'rgba(237, 109, 148, 0.1)',
  'blue-light': 'rgba(90, 202, 244, 0.1)',
  'green-light': 'rgba(93, 153, 42, 0.1)',
}

/**
 * Semantic color mapping
 */
export const SEMANTIC_COLORS = {
  primary: COLORS.YELLOW,
  secondary: COLORS.PINK,
  accent: COLORS.BLUE,
  highlight: COLORS.PINK,
  success: COLORS.BLUE,
  info: COLORS.BLUE,
  warning: COLORS.YELLOW,
  error: COLORS.PINK,
} 