import { format, parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { api } from "~/trpc/server";

const updateBookings = async () => {
  "use server";
  await api.otelms.updateBookedDates.mutate();
  revalidatePath("/cms/bookings");
};

export default async function BookingsPage() {
  const data = await api.room.getBookings.query();

  return (
    <div className="flex w-full flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Dates</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((booking) => (
            <TableRow key={booking.roomId}>
              <TableCell className="text-center">{booking.roomId}</TableCell>
              <TableCell className="flex flex-wrap gap-2">
                {/* @ts-ignore */}
                {booking.dates?.map(
                  (date: { from: string; to: string }, idx: number) => (
                    <Badge
                      className="bg-slate-100 text-black hover:text-white"
                      key={booking.roomId + "-fromTo-" + idx}
                    >
                      {format(
                        parse(date.from, "yyyy-MM-dd", new Date()),
                        "do MMMM yyy",
                      )}{" "}
                      -{" "}
                      {format(
                        parse(date.to, "yyyy-MM-dd", new Date()),
                        "do MMMM yyy",
                      )}
                    </Badge>
                  ),
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form action={updateBookings}>
        <Button className="w-full rounded-none">Update</Button>
      </form>
    </div>
  );
}
