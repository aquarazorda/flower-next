"use server";

import { format, getYear } from "date-fns";
import sgMail from "@sendgrid/mail";
import { env } from "~/env";
import { db } from "./db";
import { err, ok } from "~/app/_lib/ts-results";
import { BookingError } from "./types";

sgMail.setApiKey(env.SENDGRID_KEY);

const getCurrentYear = () => getYear(new Date());

export async function sendVerificationMail(email: string) {
  const verificationCode = Math.floor(Math.random() * 1000000);

  const msg = {
    to: email,
    from: "info@flowertbilisi.com",
    subject: "Verify your email address",
    text: "Verify your email address",
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
    <style type="text/css">
        body { background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; }
        .header { font-size: 24px; font-weight: bold; text-align: center; padding: 20px 0; }
        .content { font-size: 16px; color: #333; text-align: center; padding: 10px; }
        .footer { font-size: 14px; color: #999; text-align: center; padding: 20px; }
        .verification-code { font-size: 20px; color: #333; font-weight: bold; padding: 20px; background-color: #f9f9f9; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Email Verification</div>
        <div class="content">
            Please use the following verification code to verify your email.
        </div>
        <div class="verification-code">
${verificationCode}
        </div>
        <div class="content">
            If you did not request this code, please ignore this email.
        </div>
        <div class="footer">
            &copy; Hotel Flower, ${getCurrentYear()}
        </div>
    </div>
</body>
</html>`,
  };

  try {
    const res = await sgMail.send(msg);
    await db.verifiedEmail.upsert({
      where: { email },
      create: { email, verificationCode: String(verificationCode) },
      update: { verificationCode: String(verificationCode), status: "PENDING" },
    });

    return ok(undefined);
  } catch (e) {
    console.log(e);
    return err("Failed to send verification email, please re-try.");
  }
}

type BookingConfirmationProps = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  bookingInfo: {
    range: {
      from: Date;
      to: Date;
    };
    bookingId: string;
    msBookingId: string;
    roomNumber: string;
    numberOfGuests: number;
  };
};

export async function sendBookingConfirmationEmail({
  customer,
  bookingInfo,
}: BookingConfirmationProps) {
  const msg = {
    to: customer.email,
    from: "info@flowertbilisi.com", // TODO
    subject: "Booking Confirmation",
    text: "Booking Confirmation",
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation</title>
    <style type="text/css">
        body { background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; }
        .header { font-size: 24px; font-weight: bold; text-align: center; padding: 20px 0; }
        .content { font-size: 16px; color: #333; padding: 10px; }
        .booking-details { background-color: #f9f9f9; padding: 15px; margin-top: 15px; }
        .details-heading { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .footer { font-size: 14px; color: #999; text-align: center; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Booking Confirmation</div>
        <div class="content">
            Dear ${customer.firstName} ${customer.lastName},
            <br><br>
            Thank you for choosing Hotel Flower. We are pleased to confirm your booking.
        </div>
        <div class="booking-details">
            <div class="details-heading">Your Booking Details</div>
            <p>Confirmation Number: ${bookingInfo.bookingId}-${bookingInfo.msBookingId}</p>
            <p>Check-in Date: ${format(bookingInfo.range.from, "dd.MM.yyy")}</p>
            <p>Check-out Date: ${format(bookingInfo.range.to, "dd.MM.yyyy")}</p>
            <p>Room Number: ${bookingInfo.roomNumber}</p>
            <p>Number of Guests: ${bookingInfo.numberOfGuests}</p>
        </div>
        <div class="content">
            If you have any questions or need to make any changes to your reservation, please contact us at <a href="tel:+995598688686">+995 598 688 686</a> or <a href="mailto:info@flowertbilisi.com">info@flowertbilisi.com</a>.
            <br><br>
Thank you for staying with us.
</div>
<div class="footer">
© Hotel Flower, ${getCurrentYear()} 
</div>
</div>

</body>
</html>`,
  };

  try {
    await sgMail.send(msg);
    await db.reservation.update({
      where: {
        id: bookingInfo.bookingId,
      },
      data: {
        confirmationSent: true,
      },
    });

    return ok(undefined);
  } catch (e) {
    await db.reservation.update({
      where: {
        id: bookingInfo.bookingId,
      },
      data: {
        error: BookingError.CONFIRMATION_EMAIL,
      },
    });

    return err(BookingError.CONFIRMATION_EMAIL);
  }
}
