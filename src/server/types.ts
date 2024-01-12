import { match } from "ts-pattern";

export enum BookingError {
  INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",
  GENERIC = "GENERIC",
  INVALID_ROOM = "INVALID_ROOM",
  PRICE_MISMATCH = "PRICE_MISMATCH",
  DATES_NOT_AVAILABLE = "DATES_NOT_AVAILABLE",
}

export const getBookingErrorMessage = (error: BookingError | string) =>
  match(error)
    .with(
      BookingError.DATES_NOT_AVAILABLE,
      () => "Please choose different dates",
    )
    .with(
      BookingError.INVALID_VERIFICATION_CODE,
      () => "Invalid verification code",
    )
    .with(
      BookingError.PRICE_MISMATCH,
      BookingError.INVALID_ROOM,
      BookingError.GENERIC,
      () => "Something went wrong, please try again",
    )
    .otherwise((e) => e);
