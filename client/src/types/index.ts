/**
 * Core Application Types
 * Brutalist Luxury SaaS Platform
 * 
 * This file defines all TypeScript interfaces and types used throughout the application.
 * Maintains strict type safety and enables better IDE autocompletion.
 */

/* ============================================================================
   ANIMATION & INTERACTION TYPES
   ============================================================================ */

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  stagger?: number;
}

export interface MagneticButtonConfig {
  magneticStrength: number;
  returnSpeed: number;
  dampening: number;
}

export interface ScrollTriggerConfig {
  threshold: number;
  rootMargin: string;
  triggerOnce: boolean;
}

/* ============================================================================
   COMPONENT PROPS TYPES
   ============================================================================ */

export interface ButtonProps {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isMagnetic?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  withDivider?: boolean;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  backgroundElement?: React.ReactNode;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

export interface PricingTierProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

export interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface NavItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

/* ============================================================================
   BUSINESS LOGIC TYPES
   ============================================================================ */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'pending';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'annual';
  description: string;
  features: string[];
  isPopular: boolean;
  stripePriceId?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* ============================================================================
   STATE MANAGEMENT TYPES (Zustand)
   ============================================================================ */

export interface AppState {
  /* Theme & UI State */
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  /* User State */
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  /* Subscription State */
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  
  /* UI State */
  isNavOpen: boolean;
  toggleNav: () => void;
  
  /* Loading State */
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  /* Error State */
  error: string | null;
  setError: (error: string | null) => void;
}

/* ============================================================================
   HOOK RETURN TYPES
   ============================================================================ */

export interface UseScrollPositionReturn {
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'idle';
  isAtTop: boolean;
  isAtBottom: boolean;
}

export interface UseIntersectionReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

export interface UseMagneticReturn {
  ref: React.RefObject<HTMLElement>;
  position: { x: number; y: number };
}

export interface UseThemeReturn {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

/* ============================================================================
   WEBGL & THREE.JS TYPES
   ============================================================================ */

export interface WebGLBackgroundConfig {
  width: number;
  height: number;
  pixelRatio: number;
  particleCount: number;
  particleSize: number;
  particleSpeed: number;
  connectionDistance: number;
  accentColor: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export interface ParticleSystem {
  particles: Particle[];
  update: (deltaTime: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

/* ============================================================================
   API REQUEST/RESPONSE TYPES
   ============================================================================ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  subscription: Subscription | null;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  token: string;
  user: User;
}

export interface SubscriptionUpdateRequest {
  tierId: string;
  billingPeriod: 'monthly' | 'annual';
}

export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
}

/* ============================================================================
   UTILITY TYPES
   ============================================================================ */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T> = () => Promise<T>;
export type EventHandler<T> = (event: T) => void;

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/* ============================================================================
   FORM TYPES
   ============================================================================ */

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
}

/* ============================================================================
   NAVIGATION TYPES
   ============================================================================ */

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: NavigationItem[];
  badge?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
