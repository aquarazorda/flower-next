import { areIntervalsOverlapping } from "date-fns";

type DateRange = {
  from: Date;
  to: Date;
};

export function isDateRangeBlocked(
  targetRange: DateRange,
  blockedDates: DateRange[],
): boolean {
  return blockedDates.some((blockedRange) =>
    areIntervalsOverlapping(
      { start: targetRange.from, end: targetRange.to },
      { start: blockedRange.from, end: blockedRange.to },
    ),
  );
}
