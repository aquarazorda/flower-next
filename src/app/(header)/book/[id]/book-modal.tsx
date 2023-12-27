"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { cn } from "~/app/_lib/utils";
import { inter } from "~/app/_styles/fonts";
import BookingFormInputs from "./booking-form";
import { Button } from "~/app/_components/ui/button";
import { DateRange } from "react-day-picker";
import { DisplayPrice } from "./utils";
import { createBooking } from "~/server/bookings";
import { useFormState } from "react-dom";
import { z } from "zod";
import { phoneRegex } from "~/app/_lib/clipboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/app/_components/ui/form";

type Props = {
  range: DateRange;
  price: number;
};

const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export default function BookModal({ price, range }: Props) {
  const [state, formAction] = useFormState(createBooking.bind(null, range), {
    error: undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    defaultValues: {
      phone: "",
      lastName: "",
      firstName: "",
      email: "",
    },
  });

  return (
    <Tabs defaultValue="pay" className={cn(inter.className)}>
      <TabsList className="bg-transparent">
        <TabsTrigger
          className="rounded text-neutral-400 data-[state=active]:bg-secondaryHover data-[state=active]:text-white"
          value="pay"
        >
          Pay
        </TabsTrigger>
        <TabsTrigger
          className="rounded text-neutral-400 data-[state=active]:bg-secondaryHover data-[state=active]:text-white"
          value="reservation"
        >
          Reservation
        </TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form action={formAction}>
          <BookingFormInputs />
          {!!state.error && (
            <span className="mt-2 flex text-sm text-faily">{state.error}</span>
          )}
          <TabsContent value="pay">
            <input type="hidden" name="type" value={"pay"} />
            <DisplayPrice price={price} salePercent={5} />
            <Button
              variant="outline"
              className="mt-2 w-full"
              disabled={!form.formState.isValid}
            >
              Book
            </Button>
            <span className="mt-4 flex w-full justify-center text-center text-sm">
              Pay now and get 5% discount
            </span>
          </TabsContent>
          <TabsContent value="reservation">
            <input type="hidden" name="type" value={"reservation"} />
            <DisplayPrice price={price} />
            <Button
              variant="outline"
              className="mt-2 w-full"
              disabled={!form.formState.isValid}
            >
              Make a reservation
            </Button>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
}
