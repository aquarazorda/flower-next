import { Metadata } from "next";
import RoomsList from "~/app/_components/rooms/list";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Hotel Flower - Book a room",
};

export default async function BookPage() {
  const data = await api.room.get.query();

  return <RoomsList rooms={data} />;
}
