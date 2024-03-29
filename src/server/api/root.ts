import { createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "./routers/rooms";
import { otelmsRouter } from "./routers/otelms";
import { reservationsRouter } from "./routers/reservations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  otelms: otelmsRouter,
  reservations: reservationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
