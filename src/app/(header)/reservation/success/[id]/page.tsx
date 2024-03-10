import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/app/_components/ui/card";
import { db } from "~/server/db";
import CopyInput from "./copy-input";
import { reservation as reservationSchema } from "~/server/schema";
import { eq } from "drizzle-orm";

export default async function ReservationSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await db.query.reservation.findFirst({
    where: eq(reservationSchema.id, params.id),
    with: {
      room: true,
    },
  });

  if (!reservation) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <Card className={"font-inter"}>
        <CardHeader>
          <svg
            viewBox="0 0 24 24"
            className="mx-auto my-6 h-16 w-16 text-green-600"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <h3 className="text-center text-base font-medium text-primary md:text-2xl">
            You have successfully reserved {reservation.room?.name}!
          </h3>
          <p className="mt-2 text-base text-secondaryHover">
            Confirmation email has been sent to your email address.
          </p>
        </CardContent>
        <CardFooter className="mt-4 flex gap-4">
          <CopyInput value={params.id} className="w-full" />
          <Button asChild variant="outline" className="ml-auto">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
