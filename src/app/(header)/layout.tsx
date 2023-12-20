import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { shippori } from "../_styles/fonts";
import { Header } from "../_components/header";
import Footer from "../_components/footer";
import { Metadata } from "next";
import { Toaster } from "../_components/ui/toaster";

export const metadata: Metadata = {
  title: "Hotel Flower",
  description:
    "Hotel Flower - your gateway to Tbilisi's vibrant spirit. Uncover Georgian charm encapsulated in our modern, luxurious setting. Here, breathtaking city views meet unparalleled comfort. Your journey into the heart of Tbilisi begins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans flex min-h-screen flex-col ${shippori.className}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
