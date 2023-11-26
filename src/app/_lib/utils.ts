import { JsonValue } from "@prisma/client/runtime/library";
import { type ClassValue, clsx } from "clsx";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLastDayOfMonth = (dateString: string): Date | undefined => {
  const parts = dateString.split("-").map(Number);
  if (parts.length < 2 || parts[0] || parts[1]) {
    return undefined;
  }

  const [year, month] = parts;

  if (!year || !month) {
    return undefined;
  }

  const date = new Date(Date.UTC(year, month, 0, 4)); // GMT+4 timezone offset
  return date;
};

export const toGmt4 = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000);
};

export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};

export const getFutureDate = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + months, 1); // Set day to 1 for first day of the month
  return date.toISOString().slice(0, 10);
};

export const parsePrices = (prices: JsonValue) => {
  const pricesSchema = z.record(z.string(), z.number());
  const pricesParsed = pricesSchema.safeParse(prices);

  if (!pricesParsed.success) {
    return undefined;
  }

  return pricesParsed.data;
};

export const calculatePrices = (
  { from, to }: DateRange,
  pricesList: JsonValue,
) => {
  const prices = parsePrices(pricesList);
  if (!prices || !from || !to) return 0;

  const dates_ = [];
  let currentDate = new Date(from);
  let endDate = new Date(to);

  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    dates_.push({ month, year });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const price = dates_.reduce((acc, { month, year }) => {
    const price = prices[`${month}-${year}`];

    return price ? acc + price : 0;
  }, 0);

  return price;
};
