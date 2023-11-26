import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "../db";

export const auth = lucia({
  adapter: prismaAdapter(db),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),

  sessionCookie: {
    expires: false,
  },
});

export type Auth = typeof auth;
