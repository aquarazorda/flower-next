"use client";

import { JsonValue } from "@prisma/client/runtime/library";
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

type Props = {
  pricesList?: JsonValue;
  blockedDatesString?: JsonValue;
};

type BlockedDate = {
  from: string;
  to: string;
};

export default function BookingCalendar({
  pricesList,
  blockedDatesString,
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
    const keys = Object.keys(pricesList);
    const price = keys[keys.length - 1];
    if (!price) {
      return new Date();
    }

    return getLastDayOfMonth(price);
  }, [pricesList]);

  return (
    <div className="flex h-full flex-col justify-center">
      <Calendar
        mode="range"
        onSelect={setRange}
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
              className="mt-6 w-full text-xs"
              disabled={!range?.to || !range?.from || !price}
            >
              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            {range && <BookModal range={range} price={price} />}
          </DialogContent>
        </Dialog>
        <p className="mt-6 w-full text-left text-sm">
          Pay now and get 5% discount
        </p>
      </div>
    </div>
  );
}
