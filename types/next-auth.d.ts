import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      teacherId?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
} 