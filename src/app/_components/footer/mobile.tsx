import Link from "next/link";
import Instagram from "~/app/_assets/icons/Instagram";
import Phone from "~/app/_assets/icons/Phone";
import { cn } from "~/app/_lib/utils";
import { inter } from "~/app/_styles/fonts";

export default function MobileFooter() {
  return (
    <footer
      className={cn(
        "flex flex-col bg-secondary p-7 text-xs text-white lg:hidden lg:p-16",
        inter.className,
      )}
    >
      <nav className="flex w-full justify-between">
        <ul className="flex flex-col gap-1 font-semibold lg:text-base lg:font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/rooms">Rooms</Link>
          </li>
          <li>
            <Link href="/suites">Suites</Link>
          </li>
          <li>
            <Link href="/360">360°</Link>
          </li>
        </ul>
        <div className="mb-20 flex gap-4">
          <Phone className="h-5 w-5 cursor-pointer" />
          <Instagram className="h-5 w-5 cursor-pointer" />
        </div>
      </nav>
      <h6 className="lg:mt-20">
        Nestled in the heart of Tbilisi, we offer <br /> a blend of elegance and{" "}
        <br />
        Georgian charm. Embrace luxury <br /> with stunning city views. <br />
        All rights reserved.
      </h6>
      <div className="mt-10 flex w-full justify-between text-[10px] font-medium text-white">
        <div className="flex gap-2">
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
        <Link
          href="https://goo.gl/maps/cvMJewnVKi48uof37"
          className="text-right"
        >
          36a Lado Asatiani Street Tbilisi
        </Link>
      </div>
    </footer>
  );
}
