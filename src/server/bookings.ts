"use server";

import { DateRange } from "react-day-picker";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { capitalizeFirst, phoneRegex } from "~/app/_lib/clipboard";
import { db } from "./db";
import { calculatePrices } from "~/app/_lib/utils";
import { Either, err, ok } from "~/app/_lib/ts-results";
import { isDateRangeBlocked, reparseDate } from "~/app/_lib/date";
import { format, parseISO } from "date-fns";
import { BookingError } from "./types";
import { getDiscountedPrice } from "~/app/_lib/prices";
import { saveMsBooking } from "./otelms/bookings";
import { sendTelegramMessage } from "./telegram";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { sendBookingConfirmationEmail } from "./emails";
import { reservation, room, transaction, verifiedEmail } from "./schema";
import { eq } from "drizzle-orm";

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
  { roomId, range: rangeProp }: DataProp,
  previousState: { error?: string },
  formData: FormData,
): Promise<Either<BookingError | string, {}>> {
  const parsed = formSchema.safeParse(formData);

  if (!rangeProp.from || !rangeProp.to) {
    return err(BookingError.GENERIC);
  }

  const range = {
    from: reparseDate(rangeProp.from),
    to: reparseDate(rangeProp.to),
  };

  if (!parsed.success) {
    return err(
      capitalizeFirst(
        parsed.error.issues.map(({ message }) => message).join(", "),
      ) + ".",
    );
  }

  const data = parsed.data;

  try {
    const verificationResult = await db.transaction(async (tx) => {
      const emailRes = await tx.query.verifiedEmail.findFirst({
        where: eq(verifiedEmail.email, data.email),
        columns: {
          verificationCode: true,
        },
      });

      if (!emailRes || !emailRes.verificationCode) {
        return null;
      }

      const reservationResult = await tx
        .insert(reservation)
        .values({
          type: data.type === "pay" ? "PAYMENT" : "RESERVATION",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phone,
          dateFrom: range.from,
          dateTo: range.to,
          roomId: Number(roomId),
        })
        .returning({ id: reservation.id });

      if (!reservationResult[0]) {
        return null;
      }

      return {
        verificationCode: emailRes.verificationCode,
        reservationId: reservationResult[0].id,
      };
    });

    if (!verificationResult?.reservationId) {
      return err(BookingError.GENERIC);
    }

    if (
      !verificationResult ||
      verificationResult.verificationCode !== data.verificationCode
    ) {
      return await saveError(
        verificationResult.reservationId,
        BookingError.INVALID_VERIFICATION_CODE,
      );
    }

    const { reservationId } = verificationResult;

    await db
      .update(verifiedEmail)
      .set({
        status: "SUCCESS",
      })
      .where(eq(verifiedEmail.email, data.email));

    const validationResult = await validateReservation(
      reservationId,
      data.type,
      range,
      roomId,
    );

    if (validationResult.err) {
      return validationResult;
    }

    await db
      .update(reservation)
      .set({
        type: data.type === "pay" ? "PAYMENT" : "RESERVATION",
        price: validationResult.val.price,
        error: null,
      })
      .where(eq(reservation.id, reservationId));

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

    if (res.ok) {
      sendBookingConfirmationEmail({
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
        bookingInfo: {
          msBookingId: res.val,
          bookingId: reservationId,
          range: {
            from: validationResult.val.range.from,
            to: validationResult.val.range.to,
          },
          roomNumber: roomId,
          numberOfGuests: 2, // TODO
        },
      });

      sendTelegramMessage(`Reservation confirmed, reservation id - ${reservationId}, otelms booking id - ${res.val}
      <br /> ${data.firstName} ${data.lastName} booked ${roomId} from ${format(range.from, "yyyy-MM-dd")} to ${format(range.to, "yyyy-MM-dd")} for ${validationResult.val.price} GEL`);
    }

    redirect("/reservation/success/" + reservationId);
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return err(BookingError.GENERIC);
  }
}

const validateReservation = async (
  reservationId: string,
  type: "pay" | "reservation",
  range: DateRange,
  roomId: string,
) => {
  const roomData = await db.query.room.findFirst({
    where: eq(room.roomId, Number(roomId)),
    with: {
      blockedDate: {
        columns: {
          dates: true,
        },
      },
      prices: {
        columns: {
          list: true,
        },
      },
      info: {
        columns: {
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

  const dates = roomData.blockedDate.dates;
  const correctedDates = dates?.map(({ from, to }) => ({
    from: parseISO(from),
    to: parseISO(to),
  }));

  const isNotAvailable = correctedDates
    ? isDateRangeBlocked(range as { from: Date; to: Date }, correctedDates)
    : false;

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
  await db
    .update(reservation)
    .set({
      error: error.toString(),
    })
    .where(eq(reservation.id, id));

  return err(error);
};
