import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "utils/validation/next-auth";

export const createContext = async (ctx: trpcNext.CreateNextContextOptions) => {
  const { req, res } = ctx;
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  return {
    req,
    res,
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
