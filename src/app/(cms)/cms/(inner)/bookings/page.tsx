import { compareAsc, format } from "date-fns";
import { Badge } from "~/app/_components/ui/badge";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/app/_components/ui/table";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "~/app/_components/ui/tooltip";
import { cn } from "~/app/_lib/utils";
import { getBookingErrorMessage } from "~/server/types";
import { api } from "~/trpc/server";

const WithTooltip = ({
  children,
  maxW,
}: {
  children: React.ReactNode;
  maxW?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className={cn("truncate", maxW || "max-w-8")}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default async function Bookings() {
  const data = await api.reservations.getReservations
    .query()
    .then((d) => d.sort((a, b) => compareAsc(a.createdAt, b.createdAt)));

  return (
    <div className="flex w-full flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="auto-cols-max grid-flow-col">
          {data.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <WithTooltip>{booking.id}</WithTooltip>
              </TableCell>
              <TableCell>{booking.roomId}</TableCell>
              <TableCell>
                {booking.firstName} {booking.lastName}
              </TableCell>
              <TableCell>{booking.email}</TableCell>
              <TableCell>{booking.phoneNumber}</TableCell>
              <TableCell>
                <Badge className="bg-slate-100 text-black hover:text-white">
                  <WithTooltip maxW="max-w-fit">
                    {format(booking.dateFrom, "do MMMM yyy")} -{" "}
                    {format(booking.dateTo, "do MMMM yyy")}
                  </WithTooltip>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-slate-100 text-black hover:text-white">
                  {booking.price}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-slate-100 text-black hover:text-white">
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-slate-100 text-black hover:text-white">
                  {booking.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="max-w-16 overflow-hidden text-ellipsis bg-slate-100 text-black hover:text-white">
                  <WithTooltip>
                    {booking.error} - {getBookingErrorMessage(booking.error)}
                  </WithTooltip>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-slate-100 text-black hover:text-white">
                  {booking.createdAt && format(booking.createdAt, "dd.MM.yyyy")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
