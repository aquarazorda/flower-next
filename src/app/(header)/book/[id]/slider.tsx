"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "~/app/_hooks/useIsMobile";
import Image from "next/image";
import SliderDots from "~/app/_components/slider-dots";

type Props = {
  name: string;
  roomId: number;
  pictures: string[];
};

export default function RoomSlider({ name, roomId, pictures }: Props) {
  const isMobile = useIsMobile();
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
    <>
      <div
        ref={emblaRef}
        className="embla relative overflow-hidden lg:h-screen lg:w-5/12"
      >
        <div className="embla_container flex h-96 lg:h-full lg:flex-col">
          {pictures?.map((item, idx) => (
            <div
              className="embla__slide relative block h-full"
              key={"image-" + item}
              style={{ flex: "0 0 100%" }}
            >
              {currSlideIndex === idx ||
              currSlideIndex + 1 === idx ||
              currSlideIndex - 1 === idx ? (
                <Image
                  alt={name}
                  fill={true}
                  src={`/images/${roomId}/${item}-desktop.webp`}
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 px-8 font-shippori lg:flex-col lg:justify-center lg:px-0">
        <SliderDots
          count={pictures?.length || 3}
          current={currSlideIndex}
          moveTo={emblaApi?.scrollTo}
        />
      </div>
    </>
  );
}
