"use client";

import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "~/app/_components/ui/table";

export const RoomRow = ({
  room,
}: {
  room: { roomId: number; name: string; id: number };
}) => {
  "use client";
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      key={room.id}
      onClick={() => router.push(`/cms/room/${room.roomId}`)}
    >
      <TableCell>{room.roomId}</TableCell>
      <TableCell>{room.name}</TableCell>
      <TableCell>{room.id}</TableCell>
    </TableRow>
  );
};
