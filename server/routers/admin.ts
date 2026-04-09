import { z } from 'zod';
import { adminProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { users, auditLogs, securityEvents, usageMetrics } from '../../drizzle/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const adminRouter = router({
  /**
   * List all users with pagination
   */
  listUsers: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        role: z.enum(['user', 'admin']).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      const offset = (input.page - 1) * input.limit;

      const result = await db
        .select()
        .from(users)
        .where(input.role ? eq(users.role, input.role) : undefined)
        .limit(input.limit)
        .offset(offset);

      return {
        data: result,
        page: input.page,
        limit: input.limit,
        total: result.length,
      };
    }),

  /**
   * Get user details
   */
  getUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      const result = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return result[0];
    }),

  /**
   * Update user role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(['user', 'admin']),
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

      // Prevent demoting the last admin
      if (input.role === 'user') {
        const adminCount = await db.select().from(users).where(eq(users.role, 'admin'));
        if (adminCount.length === 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot demote the last admin',
          });
        }
      }

      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));

      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user.id,
        action: 'UPDATE_USER_ROLE',
        resource: 'user',
        resourceId: String(input.userId),
        changes: JSON.stringify({ role: input.role }),
        status: 'success',
      });

      return { success: true, message: 'User role updated' };
    }),

  /**
   * Deactivate user
   */
  deactivateUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      await db.update(users).set({ isActive: false }).where(eq(users.id, input.userId));

      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user.id,
        action: 'DEACTIVATE_USER',
        resource: 'user',
        resourceId: String(input.userId),
        status: 'success',
      });

      return { success: true, message: 'User deactivated' };
    }),

  /**
   * Get audit logs
   */
  getAuditLogs: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        userId: z.number().optional(),
        action: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      const offset = (input.page - 1) * input.limit;

      const conditions = [];

      if (input.userId) {
        conditions.push(eq(auditLogs.userId, input.userId));
      }

      if (input.action) {
        conditions.push(eq(auditLogs.action, input.action));
      }

      const result = await db
        .select()
        .from(auditLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(auditLogs.createdAt))
        .limit(input.limit)
        .offset(offset);

      return {
        data: result,
        page: input.page,
        limit: input.limit,
      };
    }),

  /**
   * Get security events
   */
  getSecurityEvents: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        resolved: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      const offset = (input.page - 1) * input.limit;

      const conditions = [];

      if (input.severity) {
        conditions.push(eq(securityEvents.severity, input.severity));
      }

      if (input.resolved !== undefined) {
        conditions.push(eq(securityEvents.resolved, input.resolved));
      }

      const result = await db
        .select()
        .from(securityEvents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(securityEvents.createdAt))
        .limit(input.limit)
        .offset(offset);

      return {
        data: result,
        page: input.page,
        limit: input.limit,
      };
    }),

  /**
   * Mark security event as resolved
   */
  resolveSecurityEvent: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      await db.update(securityEvents).set({ resolved: true }).where(eq(securityEvents.id, input.eventId));

      return { success: true, message: 'Security event marked as resolved' };
    }),

  /**
   * Get usage metrics
   */
  getUsageMetrics: adminProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        metricType: z.string().optional(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection failed',
        });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const conditions = [gte(usageMetrics.date, startDate)];

      if (input.userId) {
        conditions.push(eq(usageMetrics.userId, input.userId));
      }

      if (input.metricType) {
        conditions.push(eq(usageMetrics.metricType, input.metricType));
      }

      return await db
        .select()
        .from(usageMetrics)
        .where(and(...conditions))
        .orderBy(desc(usageMetrics.date));
    }),

  /**
   * Get system statistics
   */
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection failed',
      });
    }

    const totalUsers = await db.select().from(users);
    const activeUsers = await db.select().from(users).where(eq(users.isActive, true));

    return {
      totalUsers: totalUsers.length,
      activeUsers: activeUsers.length,
      inactiveUsers: totalUsers.length - activeUsers.length,
      timestamp: new Date(),
    };
  }),
});
