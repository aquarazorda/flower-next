"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { sendVerificationMail } from "~/server/auth/verification";

export default function BookingFormInputs() {
  const [codeSent, setCodeSent] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  useEffect(() => {
    if (codeSent) {
      setCodeTimer(60);
      const interval = setInterval(() => {
        setCodeTimer((t) => {
          if (t <= 0) {
            clearInterval(interval);
            codeSent && setCodeSent(false);
            return 0;
          }

          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [codeSent]);

  const form = useFormContext();

  const emailVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      form.setValue("verificationCode", "");
      const res = await sendVerificationMail(email);

      if (res.err) {
        form.setError("email", { type: "custom", message: res.val });
        codeSent && setCodeSent(false);
        return;
      }

      form.clearErrors("email");
      !codeSent && setCodeSent(true);
    },
    onError: () => {
      codeSent && setCodeSent(false);
      form.setError("email", {
        type: "custom",
        message: "Couldn't send email, please try again.",
      });
    },
  });

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input placeholder="Phone Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => {
          const { success } = z.string().email().safeParse(field.value);

          return (
            <FormItem className="flex">
              <div className="flex w-full gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <FormControl>
                    <Input placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
                {codeSent && codeTimer > 0 ? (
                  <Button
                    disabled
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    Resend in {codeTimer}s
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-secondaryHover hover:bg-secondaryHover/80"
                    disabled={
                      !success ||
                      form.formState.isSubmitting ||
                      emailVerificationMutation.isLoading
                    }
                    onClick={() =>
                      emailVerificationMutation.mutate(field.value)
                    }
                  >
                    Validate
                  </Button>
                )}
              </div>
            </FormItem>
          );
        }}
      />
      {codeSent && (
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Verification Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
