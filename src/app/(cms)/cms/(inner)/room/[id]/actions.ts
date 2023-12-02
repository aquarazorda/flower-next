"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { db } from "~/server/db";

export const onPriceSave = async (roomId: number, values: FormData) => {
  const schema = zfd.formData(z.record(zfd.text(), zfd.text()));

  const data = schema.safeParse(values);

  if (data.success) {
    await db.price.update({
      where: {
        roomId,
      },
      data: {
        list: data.data,
        updatedAt: new Date(),
      },
    });
  }

  revalidatePath(`/cms/cms/room/${roomId}`);
};
