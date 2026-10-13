import { createHash } from 'node:crypto';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { createLogger } from "@/lib/logger";
import { checkRateLimit, clientIp, LIMITS } from "@/lib/rate-limiter";

const logger = createLogger('nextauth')

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials, request) => {
        const ipLimit = await checkRateLimit(clientIp(request), LIMITS.auth);
        if (!ipLimit.allowed) return null;
        try {
          const validated = loginSchema.parse({
            email: credentials?.email,
            password: credentials?.password
          })

          const accountLimit = await checkRateLimit(validated.email, { ...LIMITS.auth, keyPrefix: 'auth-account' });
          if (!accountLimit.allowed) return null;
          const user = await prisma.user.findUnique({
            where: { email: validated.email }
          })

          if (!user || !user.password) {
            logger.warn({ email: validated.email }, 'User not found or no password')
            return null
          }

          const isValid = await compare(validated.password, user.password)
          if (!isValid) {
            logger.warn({ email: validated.email }, 'Invalid password')
            return null
          }

          logger.info({ userId: user.id }, 'User authenticated')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            passwordVersion: createHash("sha256").update(user.password).digest("hex")
          }
        } catch (error) {
          logger.error(error, 'Auth error')
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.passwordVersion = (user as { passwordVersion?: string }).passwordVersion;
      }
      if (token.id) {
        const current = await prisma.user.findUnique({ where: { id: token.id as string }, select: { password: true, role: true, email: true, name: true } });
        if (!current || !current.password || createHash("sha256").update(current.password).digest("hex") !== token.passwordVersion) return null;
        token.role = current.role;
        token.email = current.email;
        token.name = current.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = typeof token.role === 'string' ? token.role : 'user';
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  }
});

export async function getCurrentSession() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
      role: currentUser.role
    }
  };
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}
