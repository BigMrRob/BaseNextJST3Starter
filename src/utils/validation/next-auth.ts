import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "server/db/client";
import { loginSchema } from "utils/validation/auth";
import { Password } from "utils/validation/password";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials);
        const user = await prisma.user.findFirst({
          where: { email: creds.username },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await Password.compare(
          user.password,
          creds.password
        );

        if (!isValidPassword) {
          return null;
        }

        const { id, email, username } = user;

        return {
          id,
          email,
          username,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
  jwt: {
    secret: "super-secret",
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/",
    newUser: "/signup",
  },
};
