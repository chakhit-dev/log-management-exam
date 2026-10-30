import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt";

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

        // const user = await prisma.users.findUnique({
        //   where: {
        //     email: credentials.email,
        //   },
        //   select: {
        //     id: true,
        //     email: true,
        //     username: true,
        //     system_role: true,
        //     memberships: {
        //       select: {
        //         tenant_id: true,
        //         role: true,
        //         tenant: {
        //           select: {
        //             id: true,
        //             name: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // });

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            username: true,
            email: true,
            system_role: true,
            // memberships: true,
          },
        })

        if (!user) return null;

        // console.log(user)

        // const validPassword = await verifyPassword(
        //   credentials.password,
        //   user.password_hash
        // );

        const hashpass = bcrypt.hash(credentials.password, 12);
        const verify = bcrypt.compare(credentials.password, String(hashpass))


        if (!verify) return null;

        // const membership = user.memberships[0] ?? null;

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          systemRole: user.system_role,
          // tenant_id: membership?.tenant_id?.toString() ?? null,
          // tenant_name: membership.tenant.name ?? null,
          // role: membership?.role ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.systemRole = user.systemRole;
        // token.tenant_id = user.tenant_id;
        // token.tenant_name = user.tenant_name;
        // token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.username = token.username ?? "";
        session.user.systemRole = token.systemRole ?? "";
        // session.user.tenant_id = token.tenant_id ?? null;
        // session.user.tenant_name = token.tenant_name ?? null;
        // session.user.role = token.role ?? null;
      }

      return session;
    },
  },
});
