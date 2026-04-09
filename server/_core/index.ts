import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import helmet from "helmet";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { apiLimiter, errorHandler, requestLogger, validateInput } from "../middleware";
import { ENV, assertRuntimeEnv } from "./env";
import { serveStatic, setupVite } from "./vite";

function applyCorsHeaders(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const origin = req.headers.origin;

  if (origin && ENV.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS"
    );
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  assertRuntimeEnv();

  const app = express();
  const server = createServer(app);
  const isBundledServer = path.basename(import.meta.dirname) === "dist";
  const shouldUseVite = ENV.isDevelopment && !isBundledServer;

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestLogger);
  app.use(applyCorsHeaders);
  app.use(
    helmet({
      contentSecurityPolicy: ENV.isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              frameAncestors: ["'none'"],
              objectSrc: ["'none'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              fontSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'", "https:", "wss:"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      environment: ENV.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // Configure body parser with production-safe size limits.
  app.use(express.json({ limit: ENV.requestBodyLimit }));
  app.use(express.urlencoded({ limit: ENV.requestBodyLimit, extended: true }));
  app.use("/api", apiLimiter, validateInput);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  app.use("/api", (_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "API route not found",
      },
    });
  });

  // development mode uses Vite, production mode uses static files
  if (shouldUseVite) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use(errorHandler);

  const port = await findAvailablePort(ENV.port);

  if (port !== ENV.port) {
    console.log(`Port ${ENV.port} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
