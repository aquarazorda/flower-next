"use client";

import { format } from "date-fns";
import { useCallback, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { ButtonLoader } from "~/app/_components/ui/button-loader";
import { Input } from "~/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { getDateAsStringPrice, getNextMonth } from "~/app/_lib/utils";
import { RouterOutputs } from "~/trpc/shared";
import { onPriceSave } from "./actions";
import { redirect } from "next/navigation";

type Props = {
  room: RouterOutputs["room"]["getRoom"];
};

export default function RoomPriceListPage({ room }: Props) {
  if (!room) {
    redirect("/cms/room");
  }

  const updateWithRoomId = onPriceSave.bind(null, room.roomId);
  const [data, setData] = useState(
    (room?.prices?.list as Record<string, number>) || {
      [format(new Date(), "MM-yyyy")]: 0,
    },
  );

  const addNextMonth = useCallback(() => {
    const currMonths = Object.keys(data);
    const nextMonth = getNextMonth(currMonths[currMonths.length - 1] as string);
    setData((prev) => ({
      ...prev,
      [nextMonth]: 0,
    }));
  }, [data]);

  return (
    <form
      className="mb-2 mt-2 flex flex-col gap-6 bg-slate-100 p-6"
      action={updateWithRoomId}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* @ts-ignore */}
          {Object.keys(data).map((key) => (
            <TableRow key={key}>
              <TableCell>{getDateAsStringPrice(key)}</TableCell>
              <TableCell>
                {/* @ts-ignore */}
                <Input defaultValue={data?.[key]} name={key} />
              </TableCell>
              <TableCell>GEL</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full gap-2">
        <ButtonLoader className="w-full">Save</ButtonLoader>
        <Button
          type="button"
          variant="outline"
          className="w-1/5"
          onClick={addNextMonth}
        >
          Add month
        </Button>
      </div>
    </form>
  );
}
