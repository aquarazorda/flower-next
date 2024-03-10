import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { blockedDate, room } from "~/server/schema";

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
      return ctx.db.query.room.findMany({
        columns: {
          type: true,
          name: true,
          roomId: true,
          order: true,
          id: true,
        },
        with: {
          info: true,
        },
        orderBy: asc(room.order),
        where: !!input?.type ? eq(room.type, input.type) : undefined,
      });
    }),
  getRoom: publicProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.room.findFirst({
        where: eq(room.roomId, input),
        columns: {
          id: true,
          name: true,
          roomId: true,
        },
        with: {
          prices: {
            columns: {
              list: true,
            },
          },
          blockedDate: {
            columns: {
              dates: true,
            },
          },
          info: {
            columns: {
              msId: true,
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
      return ctx.db.query.blockedDate.findMany({
        where: input ? eq(blockedDate.roomId, input) : undefined,
      });
    }),
});
