import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }).unique(),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    passwordHash: text("passwordHash"),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "enterprise"]).default("free").notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    isActive: boolean("isActive").default(true).notNull(),
    lastLoginAt: timestamp("lastLoginAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    openIdIdx: uniqueIndex("openId_idx").on(table.openId),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription plans and billing information
 */
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    planId: varchar("planId", { length: 64 }).notNull(),
    status: mysqlEnum("status", ["active", "canceled", "past_due", "paused"]).default("active").notNull(),
    currentPeriodStart: timestamp("currentPeriodStart").notNull(),
    currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
    canceledAt: timestamp("canceledAt"),
    canceledReason: text("canceledReason"),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    pricePerMonth: decimal("pricePerMonth", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    autoRenew: boolean("autoRenew").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscription_userId_idx").on(table.userId),
    statusIdx: index("subscription_status_idx").on(table.status),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * API Keys for programmatic access
 */
export const apiKeys = mysqlTable(
  "apiKeys",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    keyHash: varchar("keyHash", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    prefix: varchar("prefix", { length: 20 }).notNull(),
    lastUsedAt: timestamp("lastUsedAt"),
    expiresAt: timestamp("expiresAt"),
    isActive: boolean("isActive").default(true).notNull(),
    permissions: text("permissions"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("apiKey_userId_idx").on(table.userId),
    prefixIdx: uniqueIndex("apiKey_prefix_idx").on(table.prefix),
  })
);

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

/**
 * Audit logs for compliance and security
 */
export const auditLogs = mysqlTable(
  "auditLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    action: varchar("action", { length: 64 }).notNull(),
    resource: varchar("resource", { length: 64 }).notNull(),
    resourceId: varchar("resourceId", { length: 255 }),
    changes: text("changes"),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    status: mysqlEnum("status", ["success", "failure"]).default("success").notNull(),
    metadata: text("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("auditLog_userId_idx").on(table.userId),
    actionIdx: index("auditLog_action_idx").on(table.action),
    resourceIdx: index("auditLog_resource_idx").on(table.resource),
    createdAtIdx: index("auditLog_createdAt_idx").on(table.createdAt),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Email verification tokens
 */
export const emailVerificationTokens = mysqlTable(
  "emailVerificationTokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 320 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("emailToken_userId_idx").on(table.userId),
    tokenIdx: uniqueIndex("emailToken_token_idx").on(table.token),
  })
);

export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;

/**
 * Password reset tokens
 */
export const passwordResetTokens = mysqlTable(
  "passwordResetTokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expiresAt").notNull(),
    usedAt: timestamp("usedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("resetToken_userId_idx").on(table.userId),
    tokenIdx: uniqueIndex("resetToken_token_idx").on(table.token),
  })
);

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Rate limiting and security tracking
 */
export const securityEvents = mysqlTable(
  "securityEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    eventType: mysqlEnum("eventType", [
      "login_attempt",
      "login_success",
      "login_failure",
      "password_change",
      "email_change",
      "api_key_created",
      "api_key_revoked",
      "suspicious_activity",
    ]).notNull(),
    ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
    userAgent: text("userAgent"),
    severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("low").notNull(),
    description: text("description"),
    resolved: boolean("resolved").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("securityEvent_userId_idx").on(table.userId),
    eventTypeIdx: index("securityEvent_eventType_idx").on(table.eventType),
    severityIdx: index("securityEvent_severity_idx").on(table.severity),
  })
);

export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;

/**
 * Analytics and usage tracking
 */
export const usageMetrics = mysqlTable(
  "usageMetrics",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    metricType: varchar("metricType", { length: 64 }).notNull(),
    value: int("value").default(0).notNull(),
    metadata: text("metadata"),
    date: timestamp("date").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("usage_userId_idx").on(table.userId),
    metricTypeIdx: index("usage_metricType_idx").on(table.metricType),
    dateIdx: index("usage_date_idx").on(table.date),
  })
);

export type UsageMetric = typeof usageMetrics.$inferSelect;
export type InsertUsageMetric = typeof usageMetrics.$inferInsert;

/**
 * Feature flags for gradual rollouts
 */
export const featureFlags = mysqlTable(
  "featureFlags",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: text("description"),
    isEnabled: boolean("isEnabled").default(false).notNull(),
    rolloutPercentage: int("rolloutPercentage").default(0).notNull(),
    allowedRoles: text("allowedRoles"),
    allowedUserIds: text("allowedUserIds"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("featureFlag_name_idx").on(table.name),
  })
);

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;