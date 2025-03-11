import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/drizzle/db";
import { teachers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      image?: string | null;
      teacherId?: string;
    }
  }

  interface User {
    teacherId?: string;
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
        identifier: { label: "Email or Teacher ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            return null;
          }

          // Try to find teacher by either email or teacherId
          const teacher = await db.query.teachers.findFirst({
            where: (teachers, { or, eq }) => or(
              eq(teachers.email, credentials.identifier.toLowerCase()),
              eq(teachers.teacherId, credentials.identifier)
            ),
          });

          if (!teacher) {
            console.log("Teacher not found");
            return null;
          }

          if (!teacher.password) {
            console.log("No password set for this account");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            teacher.password
          );

          if (!isValid) {
            console.log("Invalid password");
            return null;
          }

          return {
            id: teacher.id.toString(),
            email: teacher.email,
            teacherId: teacher.teacherId,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingTeacher = await db.query.teachers.findFirst({
          where: eq(teachers.email, user.email),
        });

        if (!existingTeacher) {
          return `/signup?oauth=google&email=${user.email}&oauthId=${user.id}`;
        }

        // Update oauthId if not set
        if (!existingTeacher.oauthId) {
          await db.update(teachers)
            .set({ oauthId: user.id })
            .where(eq(teachers.email, user.email));
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // For credentials provider
        if (user.teacherId) {
          token.teacherId = user.teacherId;
        }
        // For OAuth provider
        else if (account?.provider === "google" && token.email) {
          const teacher = await db.query.teachers.findFirst({
            where: eq(teachers.email, token.email),
          });
          if (teacher) {
            token.teacherId = teacher.teacherId;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.teacherId) {
        session.user.teacherId = token.teacherId as string;
      }
      return session;
    }
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