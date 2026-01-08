import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  
  // This is used for prisma db pull / push / migrate
  datasource: {
    url: process.env.DIRECT_URL,
  },

  // Used for PrismaClient at runtime (pgbouncer / supabase pool)
  client: {
    adapter: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
});
