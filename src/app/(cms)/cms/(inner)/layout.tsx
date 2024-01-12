import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";
import { inter } from "../../../_styles/fonts";
import { auth } from "~/server/auth/lucia";
import * as context from "next/headers";
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
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  if (!session) {
    redirect("/cms/login");
  }

  return (
    <html lang="en">
      <body
        className={`font-sans flex min-h-screen flex-col overflow-hidden ${inter.className}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="relative m-11 flex h-[90dvh] rounded-md border">
            <div className="border-r px-3 py-2">
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
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms/bookings">
                    <BookText className="mr-2 h-4 w-4" /> Bookings
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href="/cms/bookings-otelms">
                    <BookText className="mr-2 h-4 w-4" /> Otelms Bookings
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
