"use server";

import { DateRange } from "react-day-picker";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { capitalizeFirst, phoneRegex } from "~/app/_lib/clipboard";
import { db } from "./db";
import { calculatePrices } from "~/app/_lib/utils";
import { Either, err, ok } from "~/app/_lib/ts-results";
import { isDateRangeBlocked } from "~/app/_lib/date";
import { parseISO } from "date-fns";
import { BookingError } from "./types";
import { getDiscountedPrice } from "~/app/_lib/prices";
import { saveMsBooking } from "./otelms/bookings";

const formSchema = zfd.formData({
  type: zfd.text(z.enum(["pay", "reservation"])),
  firstName: zfd.text(z.string().min(2, "first name is required")),
  lastName: zfd.text(z.string().min(2, "last name is required")),
  phone: zfd.text(z.string().regex(phoneRegex, "invalid phone number")),
  email: zfd.text(z.string().email("invalid email address")),
  verificationCode: zfd.text(
    z
      .string()
      .min(5, "verification code is required")
      .max(6, "invalid verification code"),
  ),
});

type FormSchema = z.infer<typeof formSchema>;

type DataProp = {
  roomId: string;
  range: DateRange;
};

export async function createBooking(
  { roomId, range }: DataProp,
  previousState: { error?: string },
  formData: FormData,
): Promise<Either<BookingError | string, {}>> {
  const parsed = formSchema.safeParse(formData);

  if (!range.from || !range.to) {
    return err(BookingError.GENERIC);
  }

  if (!parsed.success) {
    return err(
      capitalizeFirst(
        parsed.error.issues.map(({ message }) => message).join(", "),
      ) + ".",
    );
  }

  const data = parsed.data;

  try {
    const [{ id: reservationId }, emailRes] = await db.$transaction([
      db.reservation.create({
        data: {
          type: data.type === "pay" ? "PAYMENT" : "RESERVATION",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phone,
          dateFrom: range.from,
          dateTo: range.to,
          roomId: Number(roomId),
        },
        select: {
          id: true,
        },
      }),
      db.verifiedEmail.findFirst({
        where: {
          email: data.email,
        },
        select: {
          verificationCode: true,
        },
      }),
    ]);

    if (!emailRes || emailRes.verificationCode !== data.verificationCode) {
      return await saveError(
        reservationId,
        BookingError.INVALID_VERIFICATION_CODE,
      );
    }

    await db.verifiedEmail.update({
      where: {
        email: data.email,
      },
      data: {
        status: "SUCCESS",
      },
    });

    const validationResult = await validateReservation(
      reservationId,
      data.type,
      range,
      roomId,
    );

    if (validationResult.err) {
      return validationResult;
    }

    await db.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: data.type === "pay" ? "PAID" : "RESERVED",
        price: validationResult.val.price,
        error: null,
      },
    });

    const res = await saveMsBooking({
      dateRange: validationResult.val.range,
      price: validationResult.val.price,
      type: data.type,
      msId: validationResult.val.msId,
      user: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone,
      },
      reservationId,
    });

    return res;
  } catch (e) {
    return err(BookingError.GENERIC);
  }
}

const validateReservation = async (
  reservationId: string,
  type: "pay" | "reservation",
  range: DateRange,
  roomId: string,
) => {
  const roomData = await db.room.findUnique({
    where: {
      roomId: Number(roomId),
    },
    select: {
      blockedDate: {
        select: {
          dates: true,
        },
      },
      prices: {
        select: {
          list: true,
        },
      },
      info: {
        select: {
          msId: true,
        },
      },
    },
  });

  if (
    !roomData ||
    !roomData.prices?.list ||
    !roomData.info?.msId ||
    !roomData.blockedDate ||
    !range.from ||
    !range.to
  ) {
    return await saveError(reservationId, BookingError.INVALID_ROOM);
  }

  const dates = roomData.blockedDate.dates as { from: string; to: string }[];
  const correctedDates = dates.map(({ from, to }) => ({
    from: parseISO(from),
    to: parseISO(to),
  }));

  const isNotAvailable = isDateRangeBlocked(
    range as { from: Date; to: Date },
    correctedDates,
  );

  if (isNotAvailable) {
    return await saveError(reservationId, BookingError.DATES_NOT_AVAILABLE);
  }

  const price = calculatePrices(range, roomData.prices?.list);

  if (!price || price < 50) {
    return await saveError(reservationId, BookingError.PRICE_MISMATCH);
  }

  return ok({
    price: type === "pay" ? getDiscountedPrice(price, 5) : price,
    dates,
    msId: roomData.info.msId,
    range: range as { from: Date; to: Date },
  });
};

const createReservation = async (
  { firstName, lastName, phone }: FormSchema,
  range: DateRange,
  roomId: string,
) => {
  // TODO
  // push to otelMS
  // push to planetscale
  // redirect to success or error page
};

const saveError = async (id: string, error: BookingError) => {
  await db.reservation.update({
    where: {
      id,
    },
    data: {
      error: error.toString(),
    },
  });

  return err(error);
};
