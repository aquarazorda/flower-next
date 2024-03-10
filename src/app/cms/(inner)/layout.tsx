import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";
import { validateRequest } from "~/server/auth/lucia";
import { redirect } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { Toaster } from "~/app/_components/ui/toaster";
import { AlignJustify, BookText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hotel Flower - CMS",
  description:
    "Hotel Flower - your gateway to Tbilisi's vibrant spirit. Uncover Georgian charm encapsulated in our modern, luxurious setting. Here, breathtaking city views meet unparalleled comfort. Your journey into the heart of Tbilisi begins.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/cms/login");
  }

  return (
    <html lang="en">
      <body
        className={`font-sans flex min-h-screen flex-col overflow-hidden font-inter`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="relative m-11 flex h-[90dvh] rounded-md border">
            <div className="max-w-56 border-r px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Rooms
              </h2>
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms">
                    <AlignJustify className="mr-2 h-4 w-4" /> List
                  </Link>
                </Button>
              </div>
              <h2 className="mb-2 mt-4 px-4 text-lg font-semibold tracking-tight">
                Bookings
              </h2>
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms/bookings">
                    <BookText className="mr-2 h-4 w-4" /> Confirmed
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms/bookings/pending">
                    <BookText className="mr-2 h-4 w-4" /> Pending
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms/bookings/otelms">
                    <BookText className="mr-2 h-4 w-4" /> Otelms
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex w-full overflow-y-auto">{children}</div>
          </div>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
