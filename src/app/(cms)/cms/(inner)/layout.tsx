import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";
import { inter } from "../../../_styles/fonts";
import { auth } from "~/server/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "~/app/_components/ui/button";

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
                <Button variant="secondary" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  List
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  Bookings
                </Button>
              </div>
            </div>
            <div className="flex w-full overflow-y-auto">{children}</div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
