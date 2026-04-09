const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

const nodeEnv = process.env.NODE_ENV ?? "development";

function parseAllowedOrigins(value: string | undefined): string[] {
  if (!value) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  const origins = value
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_ALLOWED_ORIGINS;
}

function parsePort(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3000;
}

export const ENV = {
  nodeEnv,
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv !== "production",
  port: parsePort(process.env.PORT),
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT ?? "1mb",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function assertRuntimeEnv(): void {
  if (!ENV.isProduction) {
    return;
  }

  const missing: string[] = [];

  if (!ENV.cookieSecret) missing.push("JWT_SECRET");
  if (!ENV.databaseUrl) missing.push("DATABASE_URL");
  if (!ENV.appId) missing.push("VITE_APP_ID");
  if (!ENV.oAuthServerUrl) missing.push("OAUTH_SERVER_URL");

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`
    );
  }
}
