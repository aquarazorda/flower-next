"use client";

import { RouterOutputs } from "~/trpc/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "~/app/_hooks/useIsMobile";
import { useEffect, useRef, useState } from "react";
import SliderDots from "../slider-dots";
import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollUpAnimation } from "~/app/_animations/scroll";

type Props = {
  suites: RouterOutputs["room"]["get"];
};

export default function SuitesCarousel({ suites }: Props) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const animationProps = useScrollUpAnimation();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: isMobile ? "x" : "y",
  });
  const [currSlideIndex, setCurrSlideIndex] = useState(0);

  useEffect(() => {
    emblaApi?.on("select", ({ selectedScrollSnap }) =>
      setCurrSlideIndex(selectedScrollSnap()),
    );
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit({
      axis: isMobile ? "x" : "y",
    });
  }, [emblaApi, isMobile]);

  return (
    <motion.div
      className="flex flex-col lg:mt-28 lg:px-32 lg:pl-24"
      {...animationProps}
    >
      <h5 className="mb-8 text-center font-shippori text-base font-medium text-neutral-500 lg:hidden lg:text-primary/90">
        Suites
      </h5>
      <div className="flex flex-col lg:flex-row">
        <div
          ref={emblaRef}
          className="embla relative aspect-video overflow-hidden lg:aspect-square lg:w-1/2"
        >
          <div className="embla__container flex h-full w-full cursor-pointer lg:flex-col">
            {suites.map((room, idx) => (
              <Link
                key={room.id}
                href={"/book/" + room.roomId}
                prefetch={false}
                className="embla__slide relative"
                style={{ flex: "0 0 100%" }}
              >
                <Image
                  alt={room.name}
                  fill={true}
                  onClick={() => router.push("/suites/" + room.roomId)}
                  src={`/images/rooms/${room.info?.pictures?.[idx] || 0}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="flex h-full w-full object-cover lg:rounded-md"
                />
                )
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-1 flex-col gap-6 px-4 lg:mt-0 lg:w-1/2 lg:flex-row lg:px-0">
          <div className="flex gap-3 lg:ml-8 lg:flex-col lg:justify-center">
            <SliderDots
              count={suites.length || 0}
              current={currSlideIndex || 0}
              moveTo={(idx) => emblaApi?.scrollTo(idx)}
            />
          </div>
          <div className="flex flex-col lg:mx-auto lg:max-w-sm lg:justify-center lg:gap-5">
            <span className="hidden text-center text-2xl text-primary lg:block lg:text-start">
              Suites
            </span>
            <span className="text-center text-[12.5px] text-primary lg:text-start lg:text-primary/90">
              Step into the refined luxury of Hotel Flower's suites, where the
              vivacity of Tbilisi meets elegance. Each suite is a tranquil
              retreat, blending modern sophistication with authentic Georgian
              allure.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
