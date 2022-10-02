// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./userRouter";
import { bankRouter } from "./bankRouter";
import { kycRouter } from "./kycRouter";
import { applicationRouter } from "./applicationRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("bank.", bankRouter)
  .merge("kyc.", kycRouter)
  .merge("application.", applicationRouter);

export type AppRouter = typeof appRouter;
