import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * The standard Prisma singleton. Next.js hot-reloads modules in development, so
 * a plain `new PrismaClient()` at module scope opens a fresh connection pool on
 * every edit until Postgres refuses more. Caching it on `globalThis` keeps one.
 *
 * Prisma 7 connects through a driver adapter rather than reading the URL out of
 * the schema; `@prisma/adapter-pg` is the right one here because we run on a
 * long-lived Node server (Render), not a serverless function.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill in the Neon connection string.",
    );
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
