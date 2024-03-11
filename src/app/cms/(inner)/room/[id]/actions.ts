"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { db } from "~/server/db";
import { price, roomInfo } from "~/server/schema";

export const onPriceSave = async (roomId: number, values: FormData) => {
  console.log(roomId);
  const schema = zfd.formData(
    z.record(
      zfd.text(),
      zfd.text().transform((t) => Number(t)),
    ),
  );

  const data = schema.safeParse(values);

  if (data.success) {
    try {
      await db
        .insert(price)
        .values({
          list: data.data,
          roomId,
        })
        .onConflictDoUpdate({
          target: price.roomId,
          set: {
            list: data.data,
            updatedAt: new Date(),
          },
        });

      revalidatePath(`/cms/room/${roomId}`);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};

export const onImageSave = async (roomId: number, values: string[]) => {
  const data = z.array(z.string()).safeParse(values);

  if (data.success) {
    await db
      .update(roomInfo)
      .set({
        pictures: values,
      })
      .where(eq(roomInfo.roomId, roomId));
  }

  revalidatePath(`/cms/cms/room/${roomId}`);
};
