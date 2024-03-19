"use client";

import { RouterOutputs } from "~/trpc/shared";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  rooms: RouterOutputs["room"]["get"];
};

export default function RoomsList({ rooms }: Props) {
  return (
    <div className={"font-inter lg:mb-24 lg:px-[5%]"}>
      {/* <RoomsFilter /> */}
      <motion.main
        variants={{
          hidden: {
            opacity: 0,
          },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="my-3 flex flex-wrap justify-center gap-10 px-7 lg:my-10 lg:grid lg:grid-cols-5 lg:gap-6"
      >
        {rooms.map((room) => (
          <motion.article
            transition={{ duration: 0.2 }}
            variants={{
              hidden: {
                opacity: 0,
              },
              show: { opacity: 1 },
            }}
            className="flex flex-col"
            key={room.id}
          >
            <Link
              prefetch={false}
              href={`/book/${room.roomId}`}
              className="relative h-64 lg:aspect-[1.17] lg:h-auto"
            >
              <Image
                alt={room.name}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={`/images/rooms/${
                  // @ts-ignore
                  room.info?.pictures?.[0] || 0
                }`}
                // onClick={() => navigate(`./${room.roomId}`)}
                className="cursor-pointer rounded-2xl object-cover object-center"
              />
            </Link>
            {/* <div className="h-full w-full rounded-xl bg-black/10" /> */}
            <div className="mt-5 flex flex-col gap-2 lg:mb-5">
              <h2 className="mt-auto flex justify-between font-medium text-zinc-500 lg:font-shippori">
                <Link prefetch={false} href={`/book/${room.roomId}`}>
                  {room.name}
                </Link>
                {/* <Button.Root onClick={showToast} className="lg:hidden"> */}
                {/*   <Icon name="share" /> */}
                {/* </Button.Root> */}
              </h2>
              <p className="line-clamp-4 w-full pr-2 text-xs text-zinc-500 xl:pr-0">
                {room.info?.description}{" "}
              </p>
              {/* <div className="mt-2 flex gap-1 text-black">
                    <For each={Array(room.persons)}>
                      {() => <SolarUserRoundedLinear className="h-4 w-4" />}
                    </For>
                    <Show when={room.extraPerson}>
                      <span className="text-neutral-500">+</span> <SolarUserRoundedLinear  className="h-4 w-4" />
                    </Show>
                  </div> */}
              {/* <button 
                    className="mt-4 w-full rounded-md bg-secondary py-2 text-center font-medium uppercase text-white hover:bg-secondaryHover"
                    onClick={() => navigate(`./${room.id}`)}
                    >
                    Check Price
                  </button> */}
            </div>
          </motion.article>
        ))}
      </motion.main>
      {/* <Portal>
        <Toast.Region>
          <Toast.List className="fixed bottom-0 right-0 z-50 bg-white p-4" />
        </Toast.Region>
      </Portal> */}
    </div>
  );
}
