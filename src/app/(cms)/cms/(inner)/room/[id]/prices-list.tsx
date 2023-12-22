"use client";

import { endOfMonth, format, isAfter, parse } from "date-fns";
import { useCallback, useMemo, useState } from "react";
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

  const prices = useMemo(() => {
    const temp = room?.prices?.list as Record<string, number>;

    return Object.keys(temp).reduce(
      (acc, key) => {
        const parsedDate = endOfMonth(parse(key, "MM-yyyy", new Date()));

        if (temp[key] !== undefined && isAfter(parsedDate, new Date())) {
          if (!acc) acc = {};
          // @ts-ignore
          acc[key] = temp[key];
        }
        return acc;
      },
      undefined as Record<string, number> | undefined,
    );
  }, [room]);

  const updateWithRoomId = onPriceSave.bind(null, room.roomId);

  const [data, setData] = useState(
    prices || {
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
          {Object.keys(data).map((key) => (
            <TableRow key={key}>
              <TableCell>{getDateAsStringPrice(key)}</TableCell>
              <TableCell>
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
