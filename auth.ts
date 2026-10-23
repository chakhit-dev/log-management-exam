import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/utils/password";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        const validPassword = await verifyPassword(
          credentials.password,
          user.password_hash
        );

        if (!validPassword) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          systemRole: user.system_role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.systemRole = user.systemRole;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.systemRole = token.systemRole as string;
      }

      return session;
    },
  },
});