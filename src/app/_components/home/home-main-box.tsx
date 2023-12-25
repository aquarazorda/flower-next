"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "~/app/_hooks/useIsMobile";

const maxPercent = 35;

export default function HomeMainBox() {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

  const scrollPercent = useMemo(() => {
    if (!scrollY || isMobile) return 0;

    if (scrollY < window.innerHeight) {
      const percent = (scrollY * 100) / window.innerHeight;
      if (percent <= maxPercent) {
        return percent;
      }
    }

    return maxPercent;
  }, [scrollY]);

  useEffect(() => {
    setScrollY(window.scrollY);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-[50vh] xl:h-[58vh]">
      <div className="relative mt-auto flex h-full flex-col items-center justify-center gap-12 lg:h-full lg:gap-0">
        <div className="absolute inset-0 z-10 bg-mobile-gradient xl:bg-landing-gradient" />
        <h1
          style={{ top: `${scrollPercent + 40}%` }}
          className="absolute z-20 hidden bg-text-gradient bg-clip-text p-2 text-center text-6xl uppercase leading-extra-tight text-transparent transition lg:block"
        >
          Hotel
          <br />
          Flower
        </h1>
        <Image
          alt="Hotel Flower Hero Image"
          src="/images/main-desktop.webp"
          className="z-0 h-full w-full object-cover"
          fill={true}
          priority
          loading="eager"
        />
      </div>
    </div>
  );
}
