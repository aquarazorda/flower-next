import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DB_URL: z.string(),
    DB_TOKEN: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    MS_URL: z.string().url(),
    SENDGRID_KEY: z.string(),
    TG_BOT_TOKEN: z.string(),
    TG_CHAT_ID: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DB_URL: process.env.DB_URL,
    DB_TOKEN: process.env.DB_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    MS_URL: process.env.MS_URL,
    SENDGRID_KEY: process.env.SENDGRID_KEY,
    TG_BOT_TOKEN: process.env.TG_BOT_TOKEN,
    TG_CHAT_ID: process.env.TG_CHAT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
