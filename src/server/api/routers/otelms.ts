import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBookedDates } from "~/server/otelms/bookings";
import { kv } from "@vercel/kv";
import { isOneHourOrOlder } from "~/app/_lib/utils";

export const getLoginCookies = async () => {
  const kvRes: { date: Date; cookie: string } | null = await kv.get(
    "otelms-login-cookies",
  );

  if (kvRes?.cookie && !isOneHourOrOlder(new Date(), new Date(kvRes.date))) {
    return kvRes.cookie;
  }

  const { MS_LOGIN_URL, MS_LOGIN_EMAIL, MS_LOGIN_PASSWORD } = env;

  if (!MS_LOGIN_URL || !MS_LOGIN_EMAIL || !MS_LOGIN_PASSWORD) {
    throw new Error("Missing env variables");
  }

  let headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  );

  var urlencoded = new URLSearchParams();
  urlencoded.append("action", "login");
  urlencoded.append("login", MS_LOGIN_EMAIL);
  urlencoded.append("password", MS_LOGIN_PASSWORD);

  const response = await fetch(MS_LOGIN_URL, {
    headers,
    body: urlencoded,
    method: "POST",
    cache: "no-store",
  });

  const cookies = response.headers.get("set-cookie")?.split(";");
  const pid = cookies?.[0];
  const cid = cookies?.[1]?.split(", ")[1];

  kv.set("otelms-login-cookies", {
    date: new Date(),
    cookie: `${pid}; ${cid}`,
  });

  return pid + "; " + cid;
};

export const otelmsRouter = createTRPCRouter({
  getBookedDates: publicProcedure.query(getBookedDates),
  updateBookedDates: publicProcedure.mutation(async ({ ctx }) => {
    const data = await getBookedDates();

    if (!data.length) {
      return [];
    }

    await ctx.db.blockedDate.deleteMany();
    await ctx.db.blockedDate.createMany({
      data,
    });

    return data;
  }),
});
