import { api } from "~/trpc/server";
import HomeMainBox from "../_components/home/home-main-box";
import RoomsCarousel from "../_components/home/rooms-carousel";
import SuitesCarousel from "../_components/home/suites-carousel";
import { Metadata } from "next";
import Restaurant from "../_components/home/restaurant";

export const metadata: Metadata = {
  title: "Hotel Flower",
  description:
    "Hotel Flower - your gateway to Tbilisi's vibrant spirit. Uncover Georgian charm encapsulated in our modern, luxurious setting. Here, breathtaking city views meet unparalleled comfort. Your journey into the heart of Tbilisi begins.",
};

export default async function Home() {
  const res = await api.room.get.query();
  const data = res.reduce(
    (acc, item) => {
      item.type === "room" ? acc.rooms.push(item) : acc.suites.push(item);
      return acc;
    },
    {
      rooms: [],
      suites: [],
    } as { rooms: typeof res; suites: typeof res },
  );

  return (
    <main>
      <HomeMainBox />
      <div className="flex justify-center px-8 py-12 align-middle lg:h-72">
        <span className="inline-flex self-center text-center text-[12.5px] text-primary lg:max-w-xl lg:text-base lg:text-primary/90">
          Welcome to Hotel Flower - your gateway to Tbilisi's vibrant spirit.
          Uncover Georgian charm encapsulated in our modern, luxurious setting.
          Here, breathtaking city views meet unparalleled comfort. Your journey
          into the heart of Tbilisi begins.
        </span>
      </div>
      <RoomsCarousel rooms={data.rooms} />
      <SuitesCarousel suites={data.suites.slice(0, 4)} />
      <Restaurant />
    </main>
  );
}
