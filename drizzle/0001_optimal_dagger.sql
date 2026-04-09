CREATE TABLE `apiKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`keyHash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`prefix` varchar(20) NOT NULL,
	`lastUsedAt` timestamp,
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`permissions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apiKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `apiKeys_keyHash_unique` UNIQUE(`keyHash`),
	CONSTRAINT `apiKey_prefix_idx` UNIQUE(`prefix`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(64) NOT NULL,
	`resource` varchar(64) NOT NULL,
	`resourceId` varchar(255),
	`changes` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`status` enum('success','failure') NOT NULL DEFAULT 'success',
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailVerificationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailVerificationTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailVerificationTokens_token_unique` UNIQUE(`token`),
	CONSTRAINT `emailToken_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `featureFlags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isEnabled` boolean NOT NULL DEFAULT false,
	`rolloutPercentage` int NOT NULL DEFAULT 0,
	`allowedRoles` text,
	`allowedUserIds` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `featureFlags_id` PRIMARY KEY(`id`),
	CONSTRAINT `featureFlags_name_unique` UNIQUE(`name`),
	CONSTRAINT `featureFlag_name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `passwordResetTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passwordResetTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `passwordResetTokens_token_unique` UNIQUE(`token`),
	CONSTRAINT `resetToken_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `securityEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`eventType` enum('login_attempt','login_success','login_failure','password_change','email_change','api_key_created','api_key_revoked','suspicious_activity') NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`userAgent` text,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`description` text,
	`resolved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `securityEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` varchar(64) NOT NULL,
	`status` enum('active','canceled','past_due','paused') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`canceledAt` timestamp,
	`canceledReason` text,
	`stripeSubscriptionId` varchar(255),
	`stripeCustomerId` varchar(255),
	`pricePerMonth` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`autoRenew` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usageMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`metricType` varchar(64) NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	`metadata` text,
	`date` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usageMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','pro','enterprise') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastLoginAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `openId_idx` UNIQUE(`openId`);--> statement-breakpoint
CREATE INDEX `apiKey_userId_idx` ON `apiKeys` (`userId`);--> statement-breakpoint
CREATE INDEX `auditLog_userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `auditLog_action_idx` ON `auditLogs` (`action`);--> statement-breakpoint
CREATE INDEX `auditLog_resource_idx` ON `auditLogs` (`resource`);--> statement-breakpoint
CREATE INDEX `auditLog_createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `emailToken_userId_idx` ON `emailVerificationTokens` (`userId`);--> statement-breakpoint
CREATE INDEX `resetToken_userId_idx` ON `passwordResetTokens` (`userId`);--> statement-breakpoint
CREATE INDEX `securityEvent_userId_idx` ON `securityEvents` (`userId`);--> statement-breakpoint
CREATE INDEX `securityEvent_eventType_idx` ON `securityEvents` (`eventType`);--> statement-breakpoint
CREATE INDEX `securityEvent_severity_idx` ON `securityEvents` (`severity`);--> statement-breakpoint
CREATE INDEX `subscription_userId_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `subscription_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `usage_userId_idx` ON `usageMetrics` (`userId`);--> statement-breakpoint
CREATE INDEX `usage_metricType_idx` ON `usageMetrics` (`metricType`);--> statement-breakpoint
CREATE INDEX `usage_date_idx` ON `usageMetrics` (`date`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);