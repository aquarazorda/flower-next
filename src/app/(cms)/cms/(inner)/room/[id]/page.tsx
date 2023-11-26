import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import EditRoomInformation from "./edit-information";
import { api } from "~/trpc/server";
import RoomPriceListPage from "./prices-list";

export default async function CMSRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await api.room.getRoom.query(params.id);

  return (
    <Tabs
      defaultValue="information"
      className="flex w-full flex-col items-center p-3"
    >
      <TabsList className="w-fit">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="prices">Prices</TabsTrigger>
        <TabsTrigger value="pictures">Pictures</TabsTrigger>
      </TabsList>
      <div className="mt-4 text-sm">
        {room?.name} / {room?.roomId}
      </div>
      <TabsContent value="information">
        <EditRoomInformation room={room} />
      </TabsContent>
      <TabsContent value="prices">
        <RoomPriceListPage room={room} />
      </TabsContent>
    </Tabs>
  );
}
