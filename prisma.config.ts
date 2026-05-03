import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "server/db/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
