import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { getDb, getUserByEmail, upsertUser } from '../db';
import { hashPassword, verifyPassword, isValidEmail, validatePasswordStrength, createTokenPair, generateToken } from '../auth';
import { TRPCError } from '@trpc/server';
import { COOKIE_NAME, ONE_YEAR_MS } from '../../shared/const';
import { users, emailVerificationTokens, passwordResetTokens } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { getSessionCookieOptions } from '../_core/cookies';
import { sdk } from '../_core/sdk';

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2).max(255),
      })
    )
    .mutation(async ({ input }) => {
      // Validate email format
      if (!isValidEmail(input.email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email format',
        });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(input.password);
      if (!passwordValidation.isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: passwordValidation.errors.join(', '),
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existingUser.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        });
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const openId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await upsertUser({
        openId,
        email: input.email,
        name: input.name,
        passwordHash,
        loginMethod: 'email',
        emailVerified: false,
        isActive: true,
      });

      const createdUser = await getUserByEmail(input.email);
      if (!createdUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user account',
        });
      }

      // Generate email verification token
      const verificationToken = generateToken();
      await db.insert(emailVerificationTokens).values({
        userId: createdUser.id,
        token: verificationToken,
        email: input.email,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // TODO: Send verification email

      return {
        success: true,
        message: 'Registration successful. Please verify your email.',
        ...(process.env.NODE_ENV === 'production' ? {} : { verificationToken }),
      };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (userResult.length === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      const user = userResult[0];

      if (!user.isActive) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This account has been deactivated',
        });
      }

      // Verify password
      if (!user.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Please verify your email before logging in',
        });
      }

      // Create tokens
      const { accessToken, refreshToken } = await createTokenPair(user.id, user.role);
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name ?? '',
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Update last login
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        },
        accessToken,
        refreshToken,
        sessionEstablished: true,
      };
    }),

  /**
   * Verify email with token
   */
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      // Find token
      const tokenResult = await db
        .select()
        .from(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, input.token))
        .limit(1);

      if (tokenResult.length === 0 || tokenResult[0].expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired verification token',
        });
      }

      const token = tokenResult[0];

      // Update user
      await db.update(users).set({ emailVerified: true }).where(eq(users.id, token.userId));

      // Delete token
      await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, token.id));

      return { success: true, message: 'Email verified successfully' };
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      // Find user
      const userResult = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      // Don't reveal if user exists
      if (userResult.length === 0) {
        return { success: true, message: 'If email exists, password reset link will be sent' };
      }

      const user = userResult[0];

      // Generate reset token
      const resetToken = generateToken();
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // TODO: Send password reset email

      return {
        success: true,
        message: 'Password reset link sent to email',
        ...(process.env.NODE_ENV === 'production' ? {} : { resetToken }),
      };
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(input.password);
      if (!passwordValidation.isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: passwordValidation.errors.join(', '),
        });
      }

      // Find token
      const tokenResult = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, input.token))
        .limit(1);

      if (tokenResult.length === 0 || tokenResult[0].expiresAt < new Date() || tokenResult[0].usedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired password reset token',
        });
      }

      const token = tokenResult[0];

      // Hash new password
      const passwordHash = await hashPassword(input.password);

      // Update user password
      await db.update(users).set({ passwordHash }).where(eq(users.id, token.userId));

      // Mark token as used
      await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, token.id));

      return { success: true, message: 'Password reset successfully' };
    }),

  /**
   * Get current user (protected)
   */
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),

  /**
   * Update user profile (protected)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255).optional(),
        bio: z.string().max(500).optional(),
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      await db
        .update(users)
        .set({
          name: input.name,
          bio: input.bio,
          avatar: input.avatar,
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true, message: 'Profile updated successfully' };
    }),
});
