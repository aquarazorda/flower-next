import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import EditRoomInformation from "./edit-information";
import { api } from "~/trpc/server";
import RoomPriceListPage from "./prices-list";
import EditRoomPictures from "./edit-pictures";
import { readdirSync } from "fs";

export default async function CMSRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await api.room.getRoom.query(params.id);

  const folders = readdirSync("./public/images/" + params.id).sort((a, b) => {
    return Number(a.split("-")[0]) - Number(b.split("-")[0]);
  });

  const imageCount = Number(folders[folders.length - 1]?.split("-")[0]);

  return (
    <Tabs
      defaultValue="information"
      className="relative flex w-full flex-col items-center p-3"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="text-sm font-medium">
          {room?.name} / {room?.roomId}
        </div>
        <TabsList className="w-fit self-center">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="pictures">Pictures</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="information">
        <EditRoomInformation room={room} />
      </TabsContent>
      <TabsContent value="prices">
        <RoomPriceListPage room={room} />
      </TabsContent>
      <TabsContent value="pictures">
        <EditRoomPictures room={room} imageCount={imageCount} />
      </TabsContent>
    </Tabs>
  );
}
