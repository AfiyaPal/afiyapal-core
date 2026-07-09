import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient as SqlitePrismaClient } from "../generated/prisma-sqlite/client";
import { PrismaClient as PostgresPrismaClient } from "../generated/prisma-postgres/client";

function createSeedPrismaClient(): PostgresPrismaClient {
  if (process.env.APP_DB === "online") {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    return new PostgresPrismaClient({
      adapter,
    });
  }

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });

  return new SqlitePrismaClient({
    adapter,
  }) as unknown as PostgresPrismaClient;
}

export const prisma = createSeedPrismaClient();
