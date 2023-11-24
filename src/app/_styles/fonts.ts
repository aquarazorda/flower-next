import { Inter } from "next/font/google";
import { Shippori_Mincho } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const shippori = Shippori_Mincho({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500"],
  display: "swap",
});
