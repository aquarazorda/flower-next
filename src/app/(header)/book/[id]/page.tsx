import { api } from "~/trpc/server";
import RoomSlider from "./slider";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CancelRounded } from "~/app/_assets/icons/CancelRounded";
import { CheckRounded } from "~/app/_assets/icons/CheckRounded";
import BookingCalendar from "./calendar";
import { cn } from "~/app/_lib/utils";
import { inter } from "~/app/_styles/fonts";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const data = await api.room.getRoom.query(params.id);

  return {
    title: `Hotel Flower - ${data?.name} - ${data?.roomId}`,
    description: data?.info?.description,
    openGraph: {
      title: `Hotel Flower - ${data?.name}`,
      description: data?.info?.description || "",
      images: [
        {
          // @ts-ignore
          url: `/_next/image?url=/images/${data?.info?.pictures?.[0]}&w=1200&q=75`,
          width: 1200,
          height: 800,
        },
      ],
    },
    twitter: {
      title: `Hotel Flower - ${data?.name}`,
      description: data?.info?.description || "",
      card: "summary_large_image",
      images: [
        // @ts-ignore
        `/_next/image?url=/images/rooms/${data?.info?.pictures?.[0]}&w=1200&q=75`,
      ],
    },
  };
}

export default async function RoomItemPage({ params }: Props) {
  const room = await api.room.getRoom.query(params.id);
  console.log(room);

  if (!room) {
    return redirect("/book");
  }

  return (
    <main className="mb-10 flex flex-col gap-6 text-neutral-500 lg:mb-0 lg:flex-row">
      <RoomSlider
        pictures={room.info?.pictures as string[]}
        roomId={room.roomId}
        name={room.name}
      />
      <div className="flex flex-col lg:mb-40 lg:flex-1 lg:flex-row lg:justify-around lg:gap-6 lg:px-8 lg:pt-20">
        <div className="px-8 font-shippori lg:my-auto lg:flex lg:flex-col">
          <h2 className="text-xl text-secondaryHover">{room.name}</h2>
          <p className="mt-5 text-pretty">{room.info?.description}</p>
          <p className="mt-2 hidden lg:block">
            The accommodation provides an ironing service, as well as business
            facilities like fax and photocopying. Non-stop information is
            available at the reception, where staff speak English, Georgian and
            Russian.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <h3 className="text-xl">Amenities</h3>
            <ul className="grid gap-4 lg:grid-cols-auto-fill">
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CancelRounded /> Non smoking room
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Private parking
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Air conditioning
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Daily housekeeping
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Tea/coffee maker
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Terrace
              </li>
              <li className="flex items-center gap-4 whitespace-nowrap">
                <CheckRounded /> Lift
              </li>
            </ul>
          </div>
          <p className="mb-4 mt-10 lg:hidden">
            The accommodation provides an ironing service, as well as business
            facilities like fax and photocopying. Non-stop information is
            available at the reception, where staff speak English, Georgian and
            Russian.
          </p>
        </div>
        <Suspense>
          {!room.prices ? (
            <div className="m-auto text-center font-shippori text-base">
              Booking for this room is not available.
            </div>
          ) : (
            <div
              className={cn(
                "flex w-full justify-center lg:pr-6",
                inter.className,
              )}
            >
              <BookingCalendar
                pricesList={room?.prices.list}
                blockedDatesString={room?.blockedDate?.dates}
              />
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
