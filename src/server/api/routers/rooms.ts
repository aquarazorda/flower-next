import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const roomRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          type: z.union([z.literal("suite"), z.literal("room")]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.room.findMany({
        select: {
          type: true,
          info: true,
          name: true,
          roomId: true,
          order: true,
        },
        orderBy: {
          order: "asc",
        },
        where: {
          type: {
            equals: input?.type,
          },
        },
      });
    }),
  getRoom: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.room.findUnique({
      where: {
        roomId: Number(input),
      },
      select: {
        id: true,
        name: true,
        roomId: true,
        prices: {
          select: {
            list: true,
          },
        },
        blockedDate: {
          select: {
            dates: true,
          },
        },
        info: {
          select: {
            description: true,
            extraPerson: true,
            persons: true,
            pictures: true,
          },
        },
      },
    });

    return data;
  }),
  getBookings: publicProcedure
    .input(z.number().optional())
    .query(({ ctx, input }) => {
      return ctx.db.blockedDate.findMany({
        where: {
          roomId: input,
        },
      });
    }),
});
