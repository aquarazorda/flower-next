import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  schema: "./src/server/schema.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_TOKEN,
  },
} satisfies Config;
