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
  const cookieJar = await getCachedCookieJar();

  if (cookieJar) {
    return fetchCookie(fetch, cookieJar);
  }

  const { MS_LOGIN_URL, MS_LOGIN_EMAIL, MS_LOGIN_PASSWORD } = env;

  var urlencoded = new URLSearchParams();
  urlencoded.append("action", "login");
  urlencoded.append("login", MS_LOGIN_EMAIL);
  urlencoded.append("password", MS_LOGIN_PASSWORD);

  const customFetch = fetchCookie(
    fetch,
    new fetchCookie.toughCookie.CookieJar(),
  );

  await customFetch(MS_LOGIN_URL, {
    body: urlencoded,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const serializedJar = customFetch.toughCookie.CookieJar.toString();

  await kv.set("otelms-login-cookies", serializedJar, {
    ex: 60 * 60,
  });

  return customFetch;
};
