import { compareDesc, format } from "date-fns";
import { Badge } from "~/app/_components/ui/badge";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "~/app/_components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { cn } from "~/app/_lib/utils";
import { RouterOutputs } from "~/trpc/shared";
import { ReservartionContextMenuActions } from "./context-menu-actions";
import { getBookingErrorMessage } from "~/server/types";
import { api } from "~/trpc/server";

export const ReservationsTable = async ({ pending }: { pending?: boolean }) => {
  const data = await api.reservations.getReservations.query().then((d) =>
    d
      .filter((item) => {
        const cond = item.status === "CONFIRMED";
        return pending ? !cond : cond;
      })
      .sort((a, b) => compareDesc(a.createdAt, b.createdAt)),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <Table>
        <ReservationTableHeaders withError={pending} />
        <TableBody className="auto-cols-max grid-flow-col">
          {data.map((booking) => (
            <ReservationTableItemData
              withError={pending}
              booking={booking}
              key={booking.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

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

export const ReservationTableHeaders = ({
  withError,
}: {
  withError?: boolean;
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Id</TableHead>
        <TableHead>Room</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone number</TableHead>
        <TableHead>Dates</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created</TableHead>
        {withError && <TableHead>Error</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

type Result = RouterOutputs["reservations"]["getReservations"];

export const ReservationTableItemData = ({
  booking,
  withError,
}: {
  booking: Result[number];
  withError?: boolean;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow key={booking.id} className="cursor-pointer">
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
              {booking.createdAt &&
                format(booking.createdAt, "dd.MM.yyyy hh:mm")}
            </Badge>
          </TableCell>
          {withError && (
            <TableCell>
              {booking.error && (
                <Badge className="max-w-16 overflow-hidden text-ellipsis bg-slate-100 text-black hover:text-white">
                  <WithTooltip>
                    {booking.error}{" "}
                    {booking.error &&
                      "-" + getBookingErrorMessage(booking.error)}
                  </WithTooltip>
                </Badge>
              )}
            </TableCell>
          )}
        </TableRow>
      </ContextMenuTrigger>
      <ReservartionContextMenuActions id={booking.id} />
    </ContextMenu>
  );
};
