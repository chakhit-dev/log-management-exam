import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    systemRole: string;
    // role: string | null;
    // tenant_id: string | null;
    // tenant_name: string | null;
  }

  interface Session {
    user: {
      id: string;
      username:string;
      systemRole: string;
      // role: string | null;
      // tenant_id: string | null;
      // tenant_name: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    systemRole?: string;
    // role?: string | null;
    // tenant_id?: string | null;
    // tenant_name: string | null;
  }
}
