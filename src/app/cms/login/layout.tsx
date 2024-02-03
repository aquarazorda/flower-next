import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { inter } from "~/app/_styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
