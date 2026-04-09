import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { ENV } from './_core/env';

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret || 'your-secret-key-change-in-production');

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(32);
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      const hash = salt.toString('hex') + ':' + derivedKey.toString('hex');
      resolve(hash);
    });
  });
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    const saltBuffer = Buffer.from(salt, 'hex');
    crypto.pbkdf2(password, saltBuffer, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Create a JWT token
 */
export async function createJWT(payload: Record<string, unknown>, expiresIn: string = '7d'): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

/**
 * Create access and refresh tokens
 */
export async function createTokenPair(userId: number, userRole: string) {
  const accessToken = await createJWT(
    {
      userId,
      role: userRole,
      type: 'access',
    },
    '15m'
  );

  const refreshToken = await createJWT(
    {
      userId,
      type: 'refresh',
    },
    '7d'
  );

  return { accessToken, refreshToken };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Generate an API key with prefix
 */
export function generateApiKey(prefix: string = 'sk'): { key: string; prefix: string; hash: string } {
  const randomPart = crypto.randomBytes(24).toString('base64url');
  const key = `${prefix}_${randomPart}`;
  const hash = hashApiKey(key);

  return {
    key,
    prefix: key.split('_')[0],
    hash,
  };
}

/**
 * Rate limiting key generator
 */
export function getRateLimitKey(identifier: string, endpoint: string): string {
  return `ratelimit:${identifier}:${endpoint}`;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
}
