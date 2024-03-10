import { blockedDate } from "~/server/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBookedDates } from "~/server/otelms/bookings";

export const otelmsRouter = createTRPCRouter({
  getBookedDates: publicProcedure.query(getBookedDates),
  updateBookedDates: publicProcedure.mutation(async ({ ctx }) => {
    const data = await getBookedDates();

    if (!data.length) {
      return [];
    }

    await ctx.db.transaction(async (tx) => {
      await tx.delete(blockedDate);
      await tx.insert(blockedDate).values(data);
    });

    return data;
  }),
});
