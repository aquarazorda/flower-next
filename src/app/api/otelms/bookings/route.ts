import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { NextRequest } from "next/server";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const GET = async (req: NextRequest) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req });
  const caller = appRouter.createCaller(ctx);
  try {
    const data = await caller.otelms.getBookedDates();

    return Response.json(data);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return Response.error();
    }
    // Another error occured
    console.error(cause);
    return Response.error();
  }
};
