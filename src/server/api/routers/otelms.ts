import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBookedDates } from "~/server/otelms/bookings";

export const getLoginCookies = async () => {
  const { MS_LOGIN_URL, MS_LOGIN_EMAIL, MS_LOGIN_PASSWORD } = env;

  if (!MS_LOGIN_URL || !MS_LOGIN_EMAIL || !MS_LOGIN_PASSWORD) {
    throw new Error("Missing env variables");
  }

  let headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

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

  return cid + "; " + pid;
};

export const otelmsRouter = createTRPCRouter({
  getBookedDates: publicProcedure.query(getBookedDates),
});
