import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/drizzle/db";
import { teachers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      teacherId?: string;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        teacherId: { label: "Teacher ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.teacherId || !credentials?.password) {
          return null;
        }

        const teacher = await db.query.teachers.findFirst({
          where: eq(teachers.teacherId, credentials.teacherId),
        });

        if (!teacher || !teacher.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, teacher.password);

        if (!isValid) {
          return null;
        }

        return {
          id: teacher.id.toString(),
          email: teacher.email,
          teacherId: teacher.teacherId,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingTeacher = await db.query.teachers.findFirst({
          where: eq(teachers.email, user.email!),
        });

        if (!existingTeacher) {
          return `/signup?oauth=google&email=${user.email}&oauthId=${user.id}`;
        }

        // Update oauthId if not set
        if (!existingTeacher.oauthId) {
          await db.update(teachers)
            .set({ oauthId: user.id })
            .where(eq(teachers.email, user.email!));
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user) {
        const teacher = await db.query.teachers.findFirst({
          where: eq(teachers.email, session.user.email!),
        });
        if (teacher) {
          session.user.teacherId = teacher.teacherId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 