import { adminRouter } from "./routers/admin";
import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { subscriptionsRouter } from "./routers/subscriptions";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,
  subscriptions: subscriptionsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
