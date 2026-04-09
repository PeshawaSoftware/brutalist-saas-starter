import { z } from 'zod';
import { publicProcedure, protectedProcedure, adminProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { subscriptions, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  pro: 29,
  enterprise: 99,
};

export const subscriptionsRouter = router({
  /**
   * Get current user's subscription
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection failed',
      });
    }

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    return result[0] || null;
  }),

  /**
   * List all subscription plans
   */
  listPlans: publicProcedure.query(async () => {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['Basic features', 'Community support', 'Limited API calls'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        features: ['All features', 'Priority support', 'Unlimited API calls', 'Advanced analytics'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        features: ['Custom features', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
      },
    ];
  }),

  /**
   * Upgrade subscription
   */
  upgrade: protectedProcedure
    .input(
      z.object({
        planId: z.enum(['free', 'pro', 'enterprise']),
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

      const price = PLAN_PRICES[input.planId];
      if (price === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid plan ID',
        });
      }

      // Check if subscription exists
      const existingResult = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      if (existingResult.length > 0) {
        // Update existing subscription
        await db
          .update(subscriptions)
          .set({
            planId: input.planId,
            status: 'active',
            pricePerMonth: String(price),
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
          })
          .where(eq(subscriptions.userId, ctx.user.id));
      } else {
        // Create new subscription
        await db.insert(subscriptions).values({
          userId: ctx.user.id,
          planId: input.planId,
          currentPeriodStart: now,
          currentPeriodEnd: nextMonth,
          pricePerMonth: String(price),
          currency: 'USD',
        });
      }

      // Update user subscription tier
      await db
        .update(users)
        .set({ subscriptionTier: input.planId as 'free' | 'pro' | 'enterprise' })
        .where(eq(users.id, ctx.user.id));

      return {
        success: true,
        message: `Upgraded to ${input.planId} plan`,
      };
    }),

  /**
   * Cancel subscription
   */
  cancel: protectedProcedure
    .input(
      z.object({
        reason: z.string().optional(),
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
        .update(subscriptions)
        .set({
          status: 'canceled',
          canceledAt: new Date(),
          canceledReason: input.reason,
          autoRenew: false,
        })
        .where(eq(subscriptions.userId, ctx.user.id));

      // Reset to free tier
      await db
        .update(users)
        .set({ subscriptionTier: 'free' })
        .where(eq(users.id, ctx.user.id));

      return {
        success: true,
        message: 'Subscription canceled',
      };
    }),

  /**
   * Admin: List all subscriptions
   */
  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection failed',
      });
    }

    return await db.select().from(subscriptions);
  }),

  /**
   * Admin: Update subscription status
   */
  adminUpdateStatus: adminProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        status: z.enum(['active', 'canceled', 'past_due', 'paused']),
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

      await db
        .update(subscriptions)
        .set({ status: input.status })
        .where(eq(subscriptions.id, input.subscriptionId));

      return { success: true, message: 'Subscription status updated' };
    }),
});
