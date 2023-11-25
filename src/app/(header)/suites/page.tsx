import { Metadata } from "next";
import RoomsList from "~/app/_components/rooms/list";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Hotel Flower - Suites",
};

export default async function RoomsPage() {
  const data = await api.room.get.query({
    type: "suite",
  });

  return <RoomsList rooms={data} />;
}
