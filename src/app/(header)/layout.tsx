import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "../_components/header";
import Footer from "../_components/footer";
import { Metadata } from "next";
import { Toaster } from "../_components/ui/toaster";
import { inter, shippori } from "../_styles/fonts";
import { cn } from "../_lib/utils";

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
    <html lang="en" className={cn(inter.variable, shippori.variable)}>
      <body className={`flex min-h-screen flex-col font-shippori`}>
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
