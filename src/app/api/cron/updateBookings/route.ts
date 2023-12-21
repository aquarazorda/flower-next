import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await api.otelms.updateBookedDates.mutate();

  return new Response(JSON.stringify(res));
}
