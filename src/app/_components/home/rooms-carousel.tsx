"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useIsMobile } from "~/app/_hooks/useIsMobile";
import { RouterOutputs } from "~/trpc/shared";
import LazyImage from "../lazy-image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  rooms: RouterOutputs["room"]["get"];
};

export default function RoomsCarousel({ rooms }: Props) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });
  const isMobile = useIsMobile();

  return (
    <div>
      <h5 className="mb-8 text-center text-base font-medium text-primary lg:mb-12 lg:mt-4 lg:text-2xl lg:font-normal">
        Rooms
      </h5>
      <div
        ref={emblaRef}
        className="embla cursor-pointer overflow-hidden pl-4 lg:pl-0"
      >
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
            },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="embla__container flex lg:ml-24"
        >
          {rooms.map((room, idx) => (
            <motion.div
              className="embla__slide relative mr-2 h-32 w-[123px] text-sm text-white lg:mr-8 lg:aspect-square lg:h-[264px] lg:w-fit"
              key={room.id}
              variants={{
                hidden: {
                  opacity: 0,
                },
                show: { opacity: 1 },
              }}
              style={{ aspectRatio: isMobile ? "9.4/10" : "" }}
            >
              <Link
                href={"/book/" + room.roomId}
                className="relative block h-full"
                prefetch={false}
              >
                {idx < 5 ? (
                  <Image
                    src={`/images/rooms/${
                      // @ts-ignore
                      room.info?.pictures?.[0] || 0
                    }`}
                    priority={idx < 3}
                    className="rounded-lg object-cover"
                    alt={room.name}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <LazyImage
                    src={`/images/rooms/${
                      // @ts-ignore
                      room.info?.pictures?.[0] || 0
                    }`}
                    className="rounded-lg object-cover"
                    alt={room.name}
                    fill={true}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="mb-10 mt-6 flex flex-col p-4 lg:my-24 lg:mb-28 lg:items-center lg:pt-2">
        <span className="text-center text-[12.5px] text-primary lg:max-w-2xl lg:text-base lg:text-primary/90">
          Relish the unique charm of Tbilisi from our stylish rooms at Hotel
          Flower. Each room harmoniously combines modern elegance with a touch
          of authentic Georgian charm, promising a stay enriched with comfort,
          luxury, and stunning cityscapes. Immerse in the vibrant rhythm of the
          city.
        </span>
      </div>
    </div>
  );
}
