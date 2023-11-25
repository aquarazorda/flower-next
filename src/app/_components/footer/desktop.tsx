import Link from "next/link";
import Instagram from "~/app/_assets/icons/Instagram";
import Phone from "~/app/_assets/icons/Phone";
import { cn } from "~/app/_lib/_utils";
import { inter } from "~/app/_styles/fonts";

export default function Desktop() {
  return (
    <>
      <footer
        className={cn(
          "hidden grow justify-between bg-secondary p-8 pb-4 text-xs text-white lg:flex",
          inter.className,
        )}
      >
        <h6 className="max-h-32 flex-1 text-sm">
          Nestled in the heart of Tbilisi, we offer <br /> a blend of elegance
          and <br />
          Georgian charm. Embrace luxury <br /> with stunning city views. <br />
          All rights reserved.
        </h6>
        <nav className="flex max-h-32 flex-1 justify-center">
          <ul className="flex flex-col gap-1 font-medium lg:text-base">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/rooms">Rooms</Link>
            </li>
            <li>
              <Link href="/suites">Suites</Link>
            </li>
            <div className="mt-auto flex gap-2 text-sm">
              <Link href="/terms-of-service">Terms of Service</Link>/
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
          </ul>
        </nav>
        <div className="flex max-h-32 flex-1 flex-col">
          <div className="flex items-center justify-end gap-4">
            <Link href="/360" className="text-base font-medium">
              360°
            </Link>
            <Phone className="h-5 w-5 cursor-pointer" />
            <Instagram className="h-5 w-5 cursor-pointer" />
          </div>
          <div className="mt-auto flex w-full justify-end text-sm font-medium">
            <Link
              href="https://goo.gl/maps/cvMJewnVKi48uof37"
              className="text-right"
            >
              36a Lado Asatiani Street Tbilisi
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
