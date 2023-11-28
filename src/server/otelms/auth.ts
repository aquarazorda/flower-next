import { kv } from "@vercel/kv";
import fetchCookie from "fetch-cookie";
import { env } from "~/env";

async function getCachedCookieJar() {
  const serializedJar: string | null = await kv.get("cookieJar");

  if (serializedJar) {
    const jar =
      fetchCookie.toughCookie.CookieJar.deserializeSync(serializedJar);
    return jar;
  }
}

export const getOtelmsFetch = async () => {
  let cookieJar = await getCachedCookieJar();

  if (cookieJar) {
    return fetchCookie(fetch, cookieJar);
  }

  cookieJar = new fetchCookie.toughCookie.CookieJar();

  const { MS_LOGIN_URL, MS_LOGIN_EMAIL, MS_LOGIN_PASSWORD } = env;

  var urlencoded = new URLSearchParams();
  urlencoded.append("action", "login");
  urlencoded.append("login", MS_LOGIN_EMAIL);
  urlencoded.append("password", MS_LOGIN_PASSWORD);

  const customFetch = fetchCookie(fetch, cookieJar);

  await customFetch(MS_LOGIN_URL, {
    body: urlencoded,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    },
  });

  const serializedJar = await cookieJar.serialize();

  await kv.set("otelms-login-cookies", serializedJar, {
    ex: 60 * 60,
  });

  return customFetch;
};
