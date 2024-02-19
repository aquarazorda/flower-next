"use client";

import update from "immutability-helper";
import type { Identifier, XYCoord } from "dnd-core";
import { useCallback, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { RouterOutputs } from "~/trpc/shared";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";
import { Label } from "~/app/_components/ui/label";
import { onImageSave } from "./actions";
import { redirect } from "next/navigation";
import { ButtonLoader } from "~/app/_components/ui/button-loader";

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
    <div
      ref={ref}
      style={{
        opacity,
        height: "256px",
        width: "256px",
      }}
      data-handler-id={handlerId}
      className="relative"
    >
      <Image
        src={url}
        sizes="512px"
        className="overflow-hidden"
        fill
        alt={`img-${id}`}
      />
    </div>
  );
};

type Props = {
  room: RouterOutputs["room"]["getRoom"];
  defaultImages: string[];
};

export default function EditRoomPictures({ room, defaultImages }: Props) {
  if (!room) {
    redirect("/cms/room");
  }

  const [displayedImages, setDisplayedImages] = useState(
    (room?.info?.pictures as string[])?.filter(
      (item) => typeof item === "string",
    ) || [],
  );

  const [availableImages, setAvailableImages] = useState(
    defaultImages.filter((item) => !displayedImages.includes(item)),
  );

  const onImageSaveBound = onImageSave.bind(null, room.roomId);

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
        setCards((prevCards: string[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as string],
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
    (imageIdx: number, image: string, listType: "displayed" | "available") => {
      return (
        <ImageElement
          key={image}
          index={imageIdx}
          id={imageIdx}
          url={`/images/rooms/${image}`}
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
        <div className="flex min-h-12 flex-wrap gap-2 bg-slate-100 p-2">
          {displayedImages.map((item, imgIdx) =>
            renderCard(imgIdx, item, "displayed"),
          )}
          {displayedImages.length < 1 &&
            availableImages.length > 0 &&
            renderCard(0, availableImages[0]!, "displayed")}
        </div>
        <Label>Available images</Label>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-2">
          {availableImages.map((item, imgIdx) =>
            renderCard(imgIdx, item, "available"),
          )}
        </div>
      </DndProvider>
      <form
        action={() => onImageSaveBound(displayedImages)}
        className="flex w-full"
      >
        <ButtonLoader className="mb-4 w-full">Save</ButtonLoader>
      </form>
    </div>
  );
}
