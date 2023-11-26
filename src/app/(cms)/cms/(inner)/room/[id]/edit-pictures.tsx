"use client";

import update from "immutability-helper";
import type { Identifier, XYCoord } from "dnd-core";
import { useCallback, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { RouterOutputs } from "~/trpc/shared";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";
import { Label } from "~/app/_components/ui/label";
import { Button } from "~/app/_components/ui/button";

type ImageElementProps = {
  id: any;
  url: string;
  index: number;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    sourceListType: string,
    targetListType: string,
  ) => void;
  listType: "displayed" | "available";
};

type DragItem = {
  index: number;
  id: string;
  type: string;
  sourceListType: "displayed" | "available";
};

const ImageElement = ({
  id,
  url,
  index,
  moveCard,
  listType,
}: ImageElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "image",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex && item.sourceListType === listType) {
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

      moveCard(dragIndex, hoverIndex, item.sourceListType, listType);
      item.index = hoverIndex;
      item.sourceListType = listType;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { id, index, sourceListType: listType };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <Image
        src={url}
        className="h-44 overflow-hidden"
        width={256}
        height={256}
        alt={`img-${id}`}
      />
    </div>
  );
};

type Props = {
  room: RouterOutputs["room"]["getRoom"];
  imageCount: number;
};

export default function EditRoomPictures({ room, imageCount }: Props) {
  const [displayedImages, setDisplayedImages] = useState(
    (room?.info?.pictures as number[]) || [],
  );
  const [availableImages, setAvailableImages] = useState(
    Array.from(Array(imageCount).keys()).filter(
      (idx) => !displayedImages.includes(idx),
    ),
  );

  const moveCard = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      sourceListType: "displayed" | "available",
      targetListType: "displayed" | "available",
    ) => {
      if (sourceListType === targetListType) {
        const setCards =
          sourceListType === "displayed"
            ? setDisplayedImages
            : setAvailableImages;
        setCards((prevCards: number[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as number],
            ],
          }),
        );
      } else {
        if (sourceListType === "displayed") {
          setDisplayedImages((prev) =>
            prev.filter((_, idx) => idx !== dragIndex),
          );

          // @ts-ignore
          setAvailableImages((prev) => [
            ...prev.slice(0, hoverIndex),
            displayedImages[dragIndex],
            ...prev.slice(hoverIndex),
          ]);
        } else {
          setAvailableImages((prev) =>
            prev.filter((_, idx) => idx !== dragIndex),
          );
          // @ts-ignore
          setDisplayedImages((prev) => [
            ...prev.slice(0, hoverIndex),
            availableImages[dragIndex],
            ...prev.slice(hoverIndex),
          ]);
        }
      }
    },
    [displayedImages, availableImages],
  );

  const renderCard = useCallback(
    (
      imageIdx: number,
      roomId: number,
      index: number,
      listType: "displayed" | "available",
    ) => {
      return (
        <ImageElement
          key={imageIdx}
          index={index}
          id={imageIdx}
          url={`/images/${roomId}/${imageIdx}-mobile.webp`}
          // @ts-ignore
          moveCard={moveCard}
          listType={listType}
        />
      );
    },
    [moveCard],
  );

  return (
    <div className="flex flex-col gap-4">
      <DndProvider backend={HTML5Backend}>
        <Label>Images which are displayed on the website</Label>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-2">
          {displayedImages.map((imgIdx, idx) =>
            // @ts-ignore
            renderCard(imgIdx, room?.roomId, idx, "displayed"),
          )}
        </div>
        <Label>Available images</Label>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-2">
          {availableImages.map((imgIdx, idx) =>
            // @ts-ignore
            renderCard(imgIdx, room?.roomId, idx, "available"),
          )}
        </div>
      </DndProvider>
      <Button className="mb-4">Save</Button>
    </div>
  );
}
