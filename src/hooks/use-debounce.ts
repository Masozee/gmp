import { useState, useEffect } from 'react';

/**
 * A hook that debounces a value
 * Useful for search inputs to prevent making API calls on every keystroke
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value or delay changes before the timeout
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
