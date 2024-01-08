"use server";

import { DateRange } from "react-day-picker";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { capitalizeFirst, phoneRegex } from "~/app/_lib/clipboard";
import { db } from "./db";

export async function createBooking(
  range: DateRange,
  previousState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const schema = zfd.formData({
    type: zfd.text(z.enum(["pay", "reservation"])),
    firstName: zfd.text(z.string().min(2, "first name is required")),
    lastName: zfd.text(z.string().min(2, "last name is required")),
    phone: zfd.text(z.string().regex(phoneRegex, "invalid phone number")),
    email: zfd.text(z.string().email("invalid email address")),
    verificationCode: zfd.text(
      z
        .string()
        .min(6, "verification code is required")
        .max(6, "invalid verification code"),
    ),
  });

  const data = schema.safeParse(formData);

  if (!data.success) {
    return {
      error:
        capitalizeFirst(
          data.error.issues.map(({ message }) => message).join(", "),
        ) + ".",
    };
  }

  const emailRes = await db.verifiedEmail.findFirst({
    where: {
      email: data.data.email,
    },
    select: {
      verificationCode: true,
    },
  });

  if (!emailRes || emailRes.verificationCode !== data.data.verificationCode) {
    return {
      error: "Invalid verification code, please re-try.",
    };
  }

  try {
    await db.verifiedEmail.update({
      where: {
        email: data.data.email,
      },
      data: {
        status: "verified",
      },
    });

    console.log(data.data.type);
  } catch (e) {
    return {
      error: "Something went wrong, please re-try.",
    };
  }

  return {};
}
