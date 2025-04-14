"use client";

import React, { createContext, useContext } from 'react';
import { COLORS, SEMANTIC_COLORS } from '@/styles/colors';

interface ThemeContextType {
  colors: typeof COLORS;
  semanticColors: typeof SEMANTIC_COLORS;
}

// Create the theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  colors: COLORS,
  semanticColors: SEMANTIC_COLORS,
});

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component that wraps the app
export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // The value will include our color schemes
  const value = {
    colors: COLORS,
    semanticColors: SEMANTIC_COLORS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext; 