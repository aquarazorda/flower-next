"use server";

import { getYear } from "date-fns";
import sgMail from "@sendgrid/mail";
import { env } from "~/env";
import { db } from "../db";
import { err, ok } from "~/app/_lib/ts-results";

sgMail.setApiKey(env.SENDGRID_KEY);

export async function sendVerificationMail(email: string) {
  const verificationCode = Math.floor(Math.random() * 1000000);
  const currYear = getYear(new Date());

  const msg = {
    to: email,
    from: "givi.gelashvili@protonmail.ch", // TODO
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
            &copy; Hotel Flower, ${currYear}
        </div>
    </div>
</body>
</html>`,
  };

  try {
    await db.verifiedEmail.upsert({
      where: { email },
      create: { email, verificationCode: String(verificationCode) },
      update: { verificationCode: String(verificationCode), status: "pending" },
    });

    await sgMail.send(msg);

    return ok(undefined);
  } catch (e) {
    return err("Failed to send verification email, please re-try.");
  }
}
