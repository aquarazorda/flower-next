"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { err, ok } from "~/app/_lib/ts-results";
import { db } from "~/server/db";
import { reservation } from "~/server/schema";

export const deleteReservation = async (id: string) => {
  try {
    await db.delete(reservation).where(eq(reservation.id, id));
  } catch (e) {
    return err(e);
  }

  revalidatePath("/cms/bookings");
  return ok({});
};
