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
import { relatedRooms } from "~/app/_assets/relatedRoomImages";
import { roomImageList } from "~/app/_assets/roomImages";

const getDefaultImages = (roomId: string) => {
  if (roomImageList[roomId]) {
    return roomImageList[roomId]?.map((item) => roomId + "/" + item);
  }

  for (const item of relatedRooms) {
    if (item.related.find((val) => val === roomId)) {
      return (
        roomImageList[item.master]?.map((img) => item.master + "/" + img) || []
      );
    }
  }
};

export default async function CMSRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await api.room.getRoom.query(params.id);
  const defaultImages = getDefaultImages(params.id);

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
      {defaultImages && (
        <TabsContent value="pictures">
          <EditRoomPictures room={room} defaultImages={defaultImages} />
        </TabsContent>
      )}
    </Tabs>
  );
}
