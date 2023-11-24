"use client";

import Link from "next/link";
import { useMemo } from "react";
import useWindowScrollPosition from "~/app/_hooks/useWindowScrollPosition";
import { cn } from "~/app/_lib/_utils";
import headerNavItems from "./headerNavItems";

export default function DesktopHeader() {
  const scrollPosition = useWindowScrollPosition();
  const isScrolled = useMemo(() => scrollPosition > 2, [scrollPosition]);

  return (
    <>
      {!!isScrolled && <div className="hidden h-14 w-full xl:flex" />}
      <header
        className={cn(
          isScrolled && "bg-opacity-80 shadow-gray-500",
          !isScrolled && "relative",
          "fixed top-0 z-10 hidden h-14 w-full items-center justify-between bg-white px-6 pr-0 text-center backdrop-blur transition-all duration-200 lg:flex",
        )}
      >
        <Link
          href="/"
          prefetch={false}
          className="w-20 cursor-pointer text-center uppercase leading-4"
        >
          Hotel Flower
        </Link>
        <nav className="flex gap-6 text-sm">
          {headerNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="w-20 text-gray-700 opacity-80 duration-200 ease-in hover:text-gray-900 hover:opacity-95"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Link
          href="/360"
          className="w-20 text-base text-gray-700 hover:text-gray-900 hover:opacity-95"
        >
          360°
        </Link>
      </header>
    </>
  );
}
