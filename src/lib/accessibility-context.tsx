"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "small" | "normal" | "large";
type CursorSize = "small" | "normal" | "large";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cursorSize: CursorSize;
  setCursorSize: (size: CursorSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  grayscale: boolean;
  setGrayscale: (enabled: boolean) => void;
  hideImages: boolean;
  setHideImages: (enabled: boolean) => void;
  highlightLinks: boolean;
  setHighlightLinks: (enabled: boolean) => void;
  boldText: boolean;
  setBoldText: (enabled: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with values from localStorage (if available)
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [cursorSize, setCursorSize] = useState<CursorSize>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load settings from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("accessibility-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || "normal");
        setCursorSize(settings.cursorSize || "normal");
        setHighContrast(settings.highContrast || false);
        setGrayscale(settings.grayscale || false);
        setHideImages(settings.hideImages || false);
        setHighlightLinks(settings.highlightLinks || false);
        setBoldText(settings.boldText || false);
        setDyslexiaFont(settings.dyslexiaFont || false);
        setReduceMotion(settings.reduceMotion || false);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = {
        fontSize,
        cursorSize,
        highContrast,
        grayscale,
        hideImages,
        highlightLinks,
        boldText,
        dyslexiaFont,
        reduceMotion,
      };
      localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    }
  }, [
    fontSize,
    cursorSize,
    highContrast,
    grayscale,
    hideImages,
    highlightLinks,
    boldText,
    dyslexiaFont,
    reduceMotion,
  ]);

  // Apply settings to the DOM
  useEffect(() => {
    // Apply font size
    document.documentElement.dataset.fontSize = fontSize;

    // Apply cursor size
    document.documentElement.dataset.cursorSize = cursorSize;

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("high-contrast");
      document.documentElement.classList.remove("dark");
    }

    // Apply grayscale
    if (grayscale) {
      document.documentElement.classList.add("grayscale");
    } else {
      document.documentElement.classList.remove("grayscale");
    }

    // Apply hide images
    if (hideImages) {
      document.documentElement.classList.add("hide-images");
    } else {
      document.documentElement.classList.remove("hide-images");
    }

    // Apply highlight links
    if (highlightLinks) {
      document.documentElement.classList.add("highlight-links");
    } else {
      document.documentElement.classList.remove("highlight-links");
    }

    // Apply bold text
    if (boldText) {
      document.documentElement.classList.add("bold-text");
    } else {
      document.documentElement.classList.remove("bold-text");
    }

    // Apply dyslexia font
    if (dyslexiaFont) {
      document.documentElement.classList.add("dyslexia-font");
    } else {
      document.documentElement.classList.remove("dyslexia-font");
    }

    // Apply reduce motion
    if (reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [
    fontSize,
    cursorSize,
    highContrast,
    grayscale,
    hideImages,
    highlightLinks,
    boldText,
    dyslexiaFont,
    reduceMotion,
  ]);

  const value = {
    fontSize,
    setFontSize,
    cursorSize,
    setCursorSize,
    highContrast,
    setHighContrast,
    grayscale,
    setGrayscale,
    hideImages,
    setHideImages,
    highlightLinks,
    setHighlightLinks,
    boldText,
    setBoldText,
    dyslexiaFont,
    setDyslexiaFont,
    reduceMotion,
    setReduceMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      {children}
    </AccessibilityContext.Provider>
  );
}; 