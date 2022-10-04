import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { nextAuthOptions } from "./next-auth";

export const requireAuth =
  async (func: GetServerSideProps) =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    );
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return func(ctx);
  };
