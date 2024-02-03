"use client";

import update from "immutability-helper";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DndProvider, XYCoord, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createPortal } from "react-dom";
import { Button } from "~/app/_components/ui/button";
import { TableCell, TableRow } from "~/app/_components/ui/table";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "~/app/_components/ui/toast";

type Room = { roomId: number; name: string; id: number };

type Props = {
  rooms: Room[];
};

export const RoomRowList = ({ rooms }: Props) => {
  const [isEdited, setIsEdited] = useState(false);
  const [list, setList_] = useState(rooms);

  const setList = (l: Room[]) => {
    setIsEdited(true);

    setList_(l);
  };

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // @ts-ignore
      setList((prevCards: Room[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Room],
          ],
        }),
      );
    },
    [list],
  );

  const onCancel = useCallback(() => {
    setIsEdited(false);
    setList_(rooms);
  }, [rooms]);

  const drawRow = useCallback((room: Room, index: number) => {
    return (
      <DraggableRoomRow
        key={room.id}
        index={index}
        room={room}
        moveRow={moveRow}
      />
    );
  }, []);

  return (
    <>
      <DndProvider backend={HTML5Backend}>{list.map(drawRow)}</DndProvider>
      {isEdited &&
        createPortal(
          <ToastProvider>
            <Toast className="w-fit" open={true}>
              <ToastDescription className="flex gap-2">
                <Button>Save</Button>
                <Button variant="destructive" onClick={onCancel}>
                  Cancel
                </Button>
              </ToastDescription>
            </Toast>
            <ToastViewport />
          </ToastProvider>,
          document.body,
        )}
    </>
  );
};

const DraggableRoomRow = ({
  room,
  index,
  moveRow,
}: {
  room: Room;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const router = useRouter();
  const ref = useRef<HTMLTableRowElement>(null);
  const [, drop] = useDrop({
    accept: "room",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    // @ts-ignore
    hover(item: { id: number; index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "room",
    item: () => {
      return { id: room.id, index };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <TableRow
      className="cursor-pointer"
      key={room.id}
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => router.push(`/cms/room/${room.roomId}`)}
    >
      <TableCell>{room.roomId}</TableCell>
      <TableCell>{room.name}</TableCell>
      <TableCell>{room.id}</TableCell>
    </TableRow>
  );
};
