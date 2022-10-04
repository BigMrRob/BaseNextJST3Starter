import { signupSchema } from "utils/validation/auth";
import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import jwt from "jsonwebtoken";
import { Password } from "utils/validation/password";
export const signupRouter = createRouter().mutation("signup", {
  input: signupSchema,
  resolve: async ({ input, ctx }) => {
    const { username, email, password } = input;
    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "User already exists",
      });
    }

    const hashedPassword = await Password.toHash(password!);

    const user = await ctx.prisma.user.create({
      data: { username: username, email, password: hashedPassword },
    });

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    ctx.session = {
      jwt: userJwt,
      expires: "50d",
    };

    return {
      status: 201,
      message: "Account created successfully",
      data: user.email,
    };
  },
});
