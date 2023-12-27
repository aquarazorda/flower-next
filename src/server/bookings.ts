"use server";

import { DateRange } from "react-day-picker";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { capitalizeFirst, phoneRegex } from "~/app/_lib/clipboard";

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
  });

  const data = schema.safeParse(formData);

  if (!data.success) {
    console.log(data.error.issues);
    return {
      error:
        capitalizeFirst(
          data.error.issues.map(({ message }) => message).join(", "),
        ) + ".",
    };
  }

  console.log(range, data);
  return {};
}
