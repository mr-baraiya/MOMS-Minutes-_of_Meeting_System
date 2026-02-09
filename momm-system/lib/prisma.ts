import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // <-- IMPORTANT
    },
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
const needsRefresh = cachedPrisma && !(cachedPrisma as PrismaClient & { supportTicket?: unknown }).supportTicket;

export const prisma = cachedPrisma && !needsRefresh ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

