"use server";

import { Err } from "ts-results";
import { auth } from "~/server/auth/lucia";
import { redirect } from "next/navigation";
import { LuciaError } from "lucia";
import { cookies } from "next/headers";
import { zfd } from "zod-form-data";
import { revalidatePath } from "next/cache";

const authSchema = zfd.formData({
  username: zfd.text(),
  password: zfd.text(),
});

export default async function login(data: FormData) {
  const res = authSchema.safeParse(data);
  if (!res.success) {
    return Err("invalid data");
  }

  const { username, password } = res.data;

  try {
    const key = await auth.useKey("username", username.toLowerCase(), password);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const sessionCookie = auth.createSessionCookie(session);

    cookies().set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return Err("Incorrect username or password");
    }
    return Err("An unknown error occurred");
  }

  redirect("/cms/bookings");
}
