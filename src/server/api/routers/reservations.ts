import { createTRPCRouter, publicProcedure } from "../trpc";

export const reservationsRouter = createTRPCRouter({
  getReservations: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.reservation.findMany();
  }),
});
