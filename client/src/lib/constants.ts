/**
 * Application Constants & Design Tokens
 * Brutalist Luxury SaaS Platform
 * 
 * Centralized configuration for animations, colors, typography, and business logic.
 * Single source of truth for all constant values across the application.
 */

/* ============================================================================
   DESIGN TOKENS - COLORS
   ============================================================================ */

export const COLORS = {
  /* Brutalist Palette */
  background: '#FFFFFF',
  foreground: '#1A1A1A',
  accent: '#00D9FF',
  accentLight: '#E0F9FF',
  accentDark: '#0099CC',
  
  /* Neutrals */
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray300: '#D0D0D0',
  gray400: '#A0A0A0',
  gray500: '#7A7A7A',
  gray600: '#4A4A4A',
  gray700: '#2A2A2A',
  gray800: '#1A1A1A',
  gray900: '#0F0F0F',
  
  /* Semantic */
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',
  
  /* Dark Mode */
  darkBg: '#0F0F0F',
  darkCard: '#1A1A1A',
  darkText: '#F5F5F5',
  darkBorder: '#2A2A2A',
} as const;

/* ============================================================================
   DESIGN TOKENS - TYPOGRAPHY
   ============================================================================ */

export const TYPOGRAPHY = {
  fontFamilies: {
    display: "'Space Mono', monospace",
    body: "'Inter', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/* ============================================================================
   DESIGN TOKENS - SPACING
   ============================================================================ */

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
  '3xl': '3rem',
  '4xl': '4rem',
  '5xl': '5rem',
  '6xl': '6rem',
  '7xl': '8rem',
  '8xl': '10rem',
} as const;

/* ============================================================================
   DESIGN TOKENS - BORDER RADIUS
   ============================================================================ */

export const BORDER_RADIUS = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

/* ============================================================================
   DESIGN TOKENS - SHADOWS
   ============================================================================ */

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

/* ============================================================================
   ANIMATION CONFIGURATIONS
   ============================================================================ */

export const ANIMATIONS = {
  /* Easing Functions */
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  /* Duration */
  duration: {
    instant: 0,
    fast: 150,
    base: 200,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },
  
  /* Stagger */
  stagger: {
    xs: 50,
    sm: 75,
    md: 100,
    lg: 150,
    xl: 200,
  },
  
  /* Delays */
  delay: {
    none: 0,
    xs: 50,
    sm: 100,
    md: 150,
    lg: 200,
    xl: 300,
  },
} as const;

/* ============================================================================
   MAGNETIC BUTTON CONFIGURATION
   ============================================================================ */

export const MAGNETIC_CONFIG = {
  strength: 0.3,
  returnSpeed: 0.15,
  dampening: 0.95,
  maxDistance: 100,
  friction: 0.85,
} as const;

/* ============================================================================
   SCROLL TRIGGER CONFIGURATION
   ============================================================================ */

export const SCROLL_TRIGGER_CONFIG = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px',
  triggerOnce: true,
} as const;

/* ============================================================================
   BREAKPOINTS
   ============================================================================ */

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/* ============================================================================
   Z-INDEX SCALE
   ============================================================================ */

export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  notification: 1090,
} as const;

/* ============================================================================
   WEBGL & PARTICLE SYSTEM CONFIGURATION
   ============================================================================ */

export const WEBGL_CONFIG = {
  particleCount: 150,
  particleSize: 2,
  particleSpeed: 0.5,
  connectionDistance: 150,
  accentColor: COLORS.accent,
  backgroundColor: COLORS.background,
  particleOpacity: 0.6,
  connectionOpacity: 0.2,
  lineWidth: 1,
} as const;

/* ============================================================================
   PRICING TIERS
   ============================================================================ */

export const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'Perfect for individuals and small teams',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Community support',
      '1 GB storage',
      'Email notifications',
    ],
    isPopular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    description: 'For growing businesses and teams',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100 GB storage',
      'Webhook integrations',
      'Custom domains',
      'Team collaboration',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    description: 'For large-scale operations',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited storage',
      'SLA guarantee',
      'Advanced security',
      'White-label options',
      'API access',
    ],
    isPopular: false,
  },
] as const;

/* ============================================================================
   FEATURES
   ============================================================================ */

export const FEATURES = [
  {
    id: 'performance',
    name: 'Lightning Fast',
    description: 'Optimized for speed with 60fps animations and zero layout shifts',
    icon: '⚡',
  },
  {
    id: 'design',
    name: 'Brutalist Design',
    description: 'Stark minimalism meets luxury with commanding typography',
    icon: '✨',
  },
  {
    id: 'interactive',
    name: 'Interactive',
    description: 'Magnetic buttons, smooth scrolling, and micro-interactions',
    icon: '🎯',
  },
  {
    id: 'responsive',
    name: 'Fully Responsive',
    description: 'Perfect experience on mobile, tablet, and desktop',
    icon: '📱',
  },
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'WCAG compliant with keyboard navigation and screen readers',
    icon: '♿',
  },
  {
    id: 'scalable',
    name: 'Scalable',
    description: 'Built with modular components and clean architecture',
    icon: '📈',
  },
] as const;

/* ============================================================================
   TESTIMONIALS
   ============================================================================ */

export const TESTIMONIALS = [
  {
    id: '1',
    quote: 'The design is absolutely stunning. Every interaction feels intentional and polished.',
    author: 'Sarah Chen',
    role: 'Design Director',
    company: 'Creative Studios',
    rating: 5,
  },
  {
    id: '2',
    quote: 'Performance is exceptional. The 60fps animations never stutter, even on older devices.',
    author: 'James Mitchell',
    role: 'CTO',
    company: 'TechCorp',
    rating: 5,
  },
  {
    id: '3',
    quote: 'The brutalist aesthetic is refreshing. No bloat, just pure functionality and beauty.',
    author: 'Elena Rodriguez',
    role: 'Product Manager',
    company: 'Innovation Labs',
    rating: 5,
  },
] as const;

/* ============================================================================
   NAVIGATION
   ============================================================================ */

export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const;

/* ============================================================================
   API ENDPOINTS
   ============================================================================ */

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  users: {
    profile: '/api/users/profile',
    update: '/api/users/profile',
  },
  subscriptions: {
    list: '/api/subscriptions',
    create: '/api/subscriptions',
    update: '/api/subscriptions/:id',
    cancel: '/api/subscriptions/:id/cancel',
  },
  analytics: {
    track: '/api/analytics/track',
  },
} as const;

/* ============================================================================
   ERROR MESSAGES
   ============================================================================ */

export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  serverError: 'Server error. Please try again later.',
} as const;

/* ============================================================================
   SUCCESS MESSAGES
   ============================================================================ */

export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully.',
  created: 'Item created successfully.',
  deleted: 'Item deleted successfully.',
  updated: 'Item updated successfully.',
  subscribed: 'You have successfully subscribed.',
} as const;

/* ============================================================================
   REGEX PATTERNS
   ============================================================================ */

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/* ============================================================================
   LOCAL STORAGE KEYS
   ============================================================================ */

export const STORAGE_KEYS = {
  theme: 'brutalist-theme',
  user: 'brutalist-user',
  token: 'brutalist-token',
  preferences: 'brutalist-preferences',
  analytics: 'brutalist-analytics',
} as const;

/* ============================================================================
   FEATURE FLAGS
   ============================================================================ */

export const FEATURE_FLAGS = {
  enableDarkMode: true,
  enableAnalytics: true,
  enableStripe: false,
  enableBeta: false,
} as const;
