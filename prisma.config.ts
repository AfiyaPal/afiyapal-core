import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "server/db/schema.prisma",

  migrations: {
    path: "server/db/migrations",
    seed: "tsx server/test/seed.ts",
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});
