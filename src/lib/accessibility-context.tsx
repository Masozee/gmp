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
  keyboardNavigation: boolean;
  setKeyboardNavigation: (enabled: boolean) => void;
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
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

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
        setKeyboardNavigation(settings.keyboardNavigation || false);
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
        keyboardNavigation,
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
    keyboardNavigation,
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

    // Apply keyboard navigation
    if (keyboardNavigation) {
      document.documentElement.classList.add("keyboard-navigation");
    } else {
      document.documentElement.classList.remove("keyboard-navigation");
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
    keyboardNavigation,
  ]);

  // Set up keyboard navigation listeners
  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea/contenteditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Tab key is handled by the browser for regular tabbing

      // Shortcut keys for navigation
      switch (e.key) {
        case "h": // Home
          if (e.altKey) {
            e.preventDefault();
            window.location.href = "/";
          }
          break;
        case "m": // Main content - skip to main
          if (e.altKey) {
            e.preventDefault();
            const main = document.querySelector("main");
            if (main) {
              (main as HTMLElement).focus();
              main.setAttribute("tabindex", "-1");
            }
          }
          break;
        case "n": // Navigation
          if (e.altKey) {
            e.preventDefault();
            const nav = document.querySelector("nav");
            if (nav) {
              (nav as HTMLElement).focus();
              nav.setAttribute("tabindex", "-1");
            }
          }
          break;
        case "f": // Footer
          if (e.altKey) {
            e.preventDefault();
            const footer = document.querySelector("footer");
            if (footer) {
              (footer as HTMLElement).focus();
              footer.setAttribute("tabindex", "-1");
            }
          }
          break;
        case "?": // Help/Shortcuts dialog
          if (e.shiftKey) {
            e.preventDefault();
            alert(
              "Keyboard Shortcuts:\n" +
              "Tab: Navigate through interactive elements\n" +
              "Shift+Tab: Navigate backwards\n" +
              "Enter/Space: Activate buttons and links\n" +
              "Alt+H: Go to home page\n" +
              "Alt+M: Skip to main content\n" +
              "Alt+N: Go to navigation\n" +
              "Alt+F: Go to footer\n" +
              "Shift+?: Show this help dialog"
            );
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboardNavigation]);

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
    keyboardNavigation,
    setKeyboardNavigation,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 