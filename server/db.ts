import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      _db = drizzle(ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const assignProvidedField = <K extends keyof InsertUser>(
      field: K,
      normalize?: (value: InsertUser[K]) => InsertUser[K]
    ) => {
      const value = user[field];
      if (value === undefined) return;

      const nextValue = normalize ? normalize(value) : value;
      (values as Record<string, unknown>)[field as string] = nextValue as unknown;
      updateSet[field as string] = nextValue as unknown;
    };

    const nullableFields = [
      "name",
      "email",
      "passwordHash",
      "loginMethod",
      "avatar",
      "bio",
    ] as const;

    nullableFields.forEach(field =>
      assignProvidedField(field, value => (value ?? null) as InsertUser[typeof field])
    );

    const passthroughFields = [
      "emailVerified",
      "lastLoginAt",
      "lastSignedIn",
      "isActive",
      "subscriptionTier",
    ] as const;

    passthroughFields.forEach(field => assignProvidedField(field));

    if (user.role !== undefined) {
      assignProvidedField("role");
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by email: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.
