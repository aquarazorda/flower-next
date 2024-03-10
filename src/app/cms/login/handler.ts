"use server";

import { Err } from "ts-results";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { zfd } from "zod-form-data";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { user } from "~/server/schema";
import { auth } from "~/server/auth/lucia";

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

  const existingUser = await db.query.user.findFirst({
    where: eq(user.username, username.toLowerCase()),
  });

  if (!existingUser) {
    return Err("Incorrect username or password");
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );

  if (!validPassword) {
    return Err("Incorrect username or password");
  }

  const session = await auth.createSession(existingUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/cms");
}
