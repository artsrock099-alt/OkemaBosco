import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * True when a DATABASE_URL is provided. Public pages degrade gracefully
 * (fallback/empty content) when no DB is configured — e.g. a frontend-only
 * Vercel deploy before the backend/DB is hosted on a VPS. Once DATABASE_URL
 * is set, all queries run normally with no code changes.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
