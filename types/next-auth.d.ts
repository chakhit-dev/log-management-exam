import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    systemRole: string;
  }

  interface Session {
    user: {
      id: string;
      systemRole: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    systemRole?: string;
  }
}