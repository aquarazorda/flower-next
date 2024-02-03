"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const MotionImage = motion(Image);

export default function HomeMainBox() {
  const imageRef = useRef(null);
  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, 800], [1, 1.4]);

  return (
    <div className="h-[50vh] xl:h-[58vh]">
      <div className="relative mt-auto flex h-full flex-col items-center justify-center gap-12 lg:h-full lg:gap-0">
        <div className="absolute inset-0 z-10 bg-mobile-gradient xl:bg-landing-gradient" />
        <motion.h1
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute z-20 hidden bg-text-gradient bg-clip-text p-2 text-center text-6xl uppercase leading-extra-tight text-transparent transition lg:block"
        >
          Hotel
          <br />
          Flower
        </motion.h1>
        <div className="relative h-full w-full overflow-hidden">
          <MotionImage
            ref={imageRef}
            alt="Hotel Flower Hero Image"
            src="/images/main-desktop.webp"
            className="z-0 h-full w-full object-cover"
            // @ts-ignore
            style={{ scale: transform }}
            fill={true}
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
