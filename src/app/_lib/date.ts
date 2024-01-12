import { areIntervalsOverlapping } from "date-fns";

type DateRange = {
  from: Date;
  to: Date;
};

export function isDateRangeBlocked(
  targetRange: DateRange,
  blockedDates: DateRange[],
): boolean {
  const compareRange = { start: targetRange.from, end: targetRange.to };

  return blockedDates.some((blockedRange) =>
    areIntervalsOverlapping(compareRange, {
      start: blockedRange.from,
      end: blockedRange.to,
    }),
  );
}
