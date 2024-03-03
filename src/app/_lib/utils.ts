import { JsonValue } from "@prisma/client/runtime/library";
import { type ClassValue, clsx } from "clsx";
import { addMinutes, addMonths, endOfMonth, format, parse } from "date-fns";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(sec: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export function isOneHourOrOlder(date1: Date, date2: Date) {
  const ONE_HOUR = 3600000; // milliseconds in one hour
  return Math.abs(date1.getTime() - date2.getTime()) >= ONE_HOUR;
}

export const getLastDayOfMonth = (dateString: string): Date | undefined => {
  const parsedDate = parse(dateString, "MM-yyyy", new Date());

  return endOfMonth(parsedDate);
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

export const getDateAsStringPrice = (d: string) => {
  const date = parse(d, "MM-yyyy", new Date());
  return format(date, "MMMM yyyy");
};

export const getNextMonth = (dateString: string) => {
  const date = parse(dateString, "MM-yyyy", new Date());
  const nextMonth = addMonths(date, 1);
  return format(nextMonth, "MM-yyyy");
};

const GMT_PLUS_4 = 240;

export const addTimeOffset = (date: Date) => {
  return addMinutes(date, GMT_PLUS_4);
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
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    dates_.push({ month, year });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const price = dates_.reduce((acc, { month, year }) => {
    const price = prices[`${month < 10 ? "0" + month : month}-${year}`];

    return price ? acc + price : 0;
  }, 0);

  return price;
};
