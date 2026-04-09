import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ANIMATIONS } from './constants';
import type { Dimensions, Position, Bounds } from '@/types';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ============================================================================
   ANIMATION UTILITIES
   ============================================================================ */

/**
 * Easing function: Cubic Bezier
 */
export const cubicBezier = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number => {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
};

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Calculate distance between two points
 */
export const distance = (p1: Position, p2: Position): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle between two points (in radians)
 */
export const angle = (p1: Position, p2: Position): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Normalize vector
 */
export const normalize = (x: number, y: number): { x: number; y: number } => {
  const length = Math.sqrt(x * x + y * y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
};

/**
 * Create staggered animation delays
 */
export const createStaggerDelays = (
  count: number,
  baseDelay: number = 0,
  staggerAmount: number = ANIMATIONS.stagger.md
): number[] => {
  return Array.from({ length: count }, (_, i) => baseDelay + i * staggerAmount);
};

/* ============================================================================
   DOM UTILITIES
   ============================================================================ */

/**
 * Get element dimensions
 */
export const getElementDimensions = (element: HTMLElement): Dimensions => {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Get element bounds
 */
export const getElementBounds = (element: HTMLElement): Bounds => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
};

/**
 * Get element center position
 */
export const getElementCenter = (element: HTMLElement): Position => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
};

/**
 * Smooth scroll to element
 */
export const smoothScrollToElement = (
  element: HTMLElement,
  offset: number = 0,
  duration: number = 1000
): void => {
  const target = element.getBoundingClientRect().top + window.scrollY - offset;
  const start = window.scrollY;
  const distance = target - start;
  let startTime: number | null = null;

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const scroll = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

/**
 * Add scroll listener with throttle
 */
export const addScrollListener = (
  callback: (scrollY: number) => void,
  throttleDelay: number = 16
): (() => void) => {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = (): void => {
    const now = Date.now();

    if (timeoutId) clearTimeout(timeoutId);

    if (now - lastCall >= throttleDelay) {
      lastCall = now;
      callback(window.scrollY);
    } else {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        callback(window.scrollY);
      }, throttleDelay - (now - lastCall));
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (timeoutId) clearTimeout(timeoutId);
  };
};

/**
 * Request animation frame wrapper with cleanup
 */
export const animationLoop = (
  callback: (deltaTime: number) => void
): (() => void) => {
  let lastTime = Date.now();
  let frameId: number | null = null;

  const loop = (): void => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    callback(deltaTime);
    frameId = requestAnimationFrame(loop);
  };

  frameId = requestAnimationFrame(loop);

  return () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  };
};

/* ============================================================================
   STRING UTILITIES
   ============================================================================ */

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/* ============================================================================
   VALIDATION UTILITIES
   ============================================================================ */

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/* ============================================================================
   STORAGE UTILITIES
   ============================================================================ */

/**
 * Safe localStorage getter
 */
export const getFromStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue ?? null;
  } catch {
    return defaultValue ?? null;
  }
};

/**
 * Safe localStorage setter
 */
export const setToStorage = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/* ============================================================================
   DEBOUNCE & THROTTLE
   ============================================================================ */

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/* ============================================================================
   ASYNC UTILITIES
   ============================================================================ */

/**
 * Delay execution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
