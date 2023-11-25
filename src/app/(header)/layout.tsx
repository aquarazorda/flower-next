import "~/app/_styles/globals.css";

import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { shippori } from "../_styles/fonts";
import { Header } from "../_components/header";
import Footer from "../_components/footer";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        </TRPCReactProvider>
      </body>
    </html>
  );
}
