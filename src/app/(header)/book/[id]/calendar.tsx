"use client";

import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/app/_components/ui/button";
import { Calendar } from "~/app/_components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { calculatePrices, getLastDayOfMonth } from "~/app/_lib/utils";
import BookModal from "./book-modal";
import { DisplayPrice } from "./utils";
import { isDateRangeBlocked } from "~/app/_lib/date";

type Props = {
  pricesList?: Record<string, number>;
  blockedDatesString?: { from: string; to: string }[];
  roomId: string;
};

type BlockedDate = {
  from: string;
  to: string;
};

export default function BookingCalendar({
  pricesList,
  blockedDatesString,
  roomId,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();

  const blockedDates = useMemo(() => {
    const bd = blockedDatesString as BlockedDate[] | undefined;

    return (
      bd?.map(({ from, to }) => ({ from: new Date(from), to: new Date(to) })) ||
      []
    );
  }, [blockedDatesString]);

  const price = useMemo(() => {
    if (range?.from && range?.to && pricesList) {
      return calculatePrices(range, pricesList);
    }

    return 0;
  }, [range, pricesList]);

  const maxDate = useMemo(() => {
    if (!pricesList) return new Date();
    const keys = Object.keys(pricesList).sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");

      const dateA = `${yearA}-${monthA}`;
      const dateB = `${yearB}-${monthB}`;

      return dateA.localeCompare(dateB);
    });

    const price = keys[keys.length - 1];
    if (!price) {
      return new Date();
    }

    return getLastDayOfMonth(price);
  }, [pricesList]);

  const onSelect = (range?: DateRange) => {
    if (range && range.from && range.to) {
      const isBlocked = isDateRangeBlocked(
        { from: range.from, to: range.to },
        blockedDates,
      );

      if (isBlocked) {
        return setRange(undefined);
      }
    }

    setRange(range);
  };

  return (
    <div
      className={`mx-auto my-8 flex flex-col justify-center font-inter lg:my-0`}
    >
      <Calendar
        mode="range"
        className="my-auto p-0"
        onSelect={(range) => onSelect(range)}
        selected={range}
        fromDate={new Date()}
        toDate={maxDate}
        disabled={blockedDates}
      />
      <div className="px-2">
        <DisplayPrice price={price} salePercent={5} />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-4 w-full text-xs lg:mt-8"
              disabled={!range?.to || !range?.from || !price}
            >
              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            {range && <BookModal range={range} price={price} roomId={roomId} />}
          </DialogContent>
        </Dialog>
        {/* <p className="mt-6 w-full text-left text-sm"> */}
        {/*   Pay now and get 5% discount */}
        {/* </p> */}
      </div>
    </div>
  );
}
