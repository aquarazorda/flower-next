import { format, parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { Badge } from "~/app/_components/ui/badge";
import { ButtonLoader } from "~/app/_components/ui/button-loader";
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
          {data
            .sort((a, b) => a.roomId - b.roomId)
            .map((booking) => (
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
        <ButtonLoader className="w-full rounded-none">Update</ButtonLoader>
      </form>
    </div>
  );
}
