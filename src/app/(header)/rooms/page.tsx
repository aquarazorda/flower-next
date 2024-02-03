import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import RoomsList from "~/app/_components/rooms/list";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Hotel Flower - Rooms",
};

const fetchRooms = unstable_cache(
  () =>
    api.room.get.query({
      type: "room",
    }),
  ["ROOMS"],
);

export default async function RoomsPage() {
  const data = await fetchRooms();
  return <RoomsList rooms={data} />;
}
