import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { sendMagicLinkEmail } from "@/lib/email";
import type { Provider } from "next-auth/providers";

// Build providers array - only include Resend if API key is configured
const providers: Provider[] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email as string,
        },
      });

      if (!user || !user.password) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password as string,
        user.password,
      );

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    },
  }),
];

// Only add Resend provider if API key is configured (not in CI/test environments)
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("re_test_")) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.FROM_EMAIL || "LLM-Med <noreply@mail.llm-med.art>",
      sendVerificationRequest: sendMagicLinkEmail,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      // Always ensure role is set - fetch from DB if missing
      if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Magic link sign-in: only allow users who already exist in the DB
      // (pre-created via admin invite). Prevents strangers from self-registering.
      if (account?.provider === "resend" && user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { id: true },
        });
        if (!existingUser) {
          return false; // Shows "Access denied" error page
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If the callback URL is the home page and user is a grader, redirect to grading
      // This is checked in the jwt callback via token, but we need to handle it here too
      // For now, we'll rely on the client-side redirect logic
      // Always allow relative URLs or URLs on the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper function to verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
