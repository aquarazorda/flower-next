"use server";

import { revalidatePath } from "next/cache";
import { err, ok } from "~/app/_lib/ts-results";
import { db } from "~/server/db";

export const deleteReservation = async (id: string) => {
  try {
    await db.reservation.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return err(e);
  }

  revalidatePath("/cms/bookings");
  return ok({});
};
