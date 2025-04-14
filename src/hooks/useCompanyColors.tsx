"use client";

import { useTheme } from "@/components/theme-context";

/**
 * Hook to access company colors in components
 * @returns Object with color values and utility functions
 */
export function useCompanyColors() {
  const { colors, semanticColors } = useTheme();
  
  // Helper function to get color with opacity
  const getColorWithOpacity = (color: string, opacity: number) => {
    // Convert hex to rgba
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };
  
  // Helper to get CSS classes for company colors
  const getColorClasses = (color: keyof typeof colors) => {
    const colorValue = colors[color];
    
    return {
      // Background classes
      bg: `bg-[${colorValue}]`,
      bgHover: `hover:bg-[${colorValue}]`,
      bgLight: `bg-[${getColorWithOpacity(colorValue, 0.1)}]`,
      bgMedium: `bg-[${getColorWithOpacity(colorValue, 0.5)}]`,
      
      // Text classes
      text: `text-[${colorValue}]`,
      textHover: `hover:text-[${colorValue}]`,
      
      // Border classes
      border: `border-[${colorValue}]`,
      borderHover: `hover:border-[${colorValue}]`,
      
      // Tailwind utility for gradient
      gradient: `from-[${colorValue}]`,
      
      // Combined common patterns
      button: `bg-[${colorValue}] hover:bg-[${getColorWithOpacity(colorValue, 0.9)}] text-white`,
      outlineButton: `border border-[${colorValue}] text-[${colorValue}] hover:bg-[${getColorWithOpacity(colorValue, 0.1)}]`,
    };
  };
  
  // Return all colors and utilities
  return {
    colors,
    semanticColors,
    getColorWithOpacity,
    getColorClasses,
    // Pre-defined color classes for common elements
    classes: {
      green: getColorClasses('GREEN'),
      yellow: getColorClasses('YELLOW'),
      blue: getColorClasses('BLUE'),
      pink: getColorClasses('PINK'),
      
      // Semantic color classes
      primary: getColorClasses('GREEN'),
      secondary: getColorClasses('YELLOW'),
      accent: getColorClasses('BLUE'),
      highlight: getColorClasses('PINK'),
    },
  };
} 