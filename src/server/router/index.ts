// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { signupRouter } from "./signup";
export const appRouter = createRouter()
  .transformer(superjson)
  .merge(signupRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
