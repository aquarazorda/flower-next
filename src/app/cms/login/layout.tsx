import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { inter } from "~/app/_styles/fonts";
import { auth } from "~/server/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  if (session) {
    redirect("/cms");
  }

  return (
    <html lang="en">
      <body
        className={`font-sans flex min-h-screen flex-col ${inter.className}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
