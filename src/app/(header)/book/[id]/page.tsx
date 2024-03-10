import { api } from "~/trpc/server";
import RoomSlider from "./slider";
import { redirect } from "next/navigation";
import { Suspense, lazy } from "react";
import { CancelRounded } from "~/app/_assets/icons/CancelRounded";
import { CheckRounded } from "~/app/_assets/icons/CheckRounded";

type Props = {
  params: { id: string };
};

export const revalidate = 180;

const BookingCalendar = lazy(() => import("./calendar"));

export async function generateMetadata({ params }: Props) {
  const data = await api.room.getRoom.query(Number(params.id));

  return {
    title: `Hotel Flower - ${data?.name} - ${data?.roomId}`,
    description: data?.info?.description,
    openGraph: {
      title: `Hotel Flower - ${data?.name}`,
      description: data?.info?.description || "",
      images: [
        {
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
        `/_next/image?url=/images/rooms/${data?.info?.pictures?.[0]}&w=1200&q=75`,
      ],
    },
  };
}

export default async function RoomItemPage({ params }: Props) {
  const room = await api.room.getRoom.query(Number(params.id));

  if (!room) {
    return redirect("/book");
  }

  return (
    <main className="relative mb-10 flex flex-col gap-6 text-neutral-500 lg:mb-0 lg:flex-row">
      <RoomSlider
        pictures={room.info?.pictures as string[]}
        roomId={room.roomId}
        name={room.name}
      />
      <div className="flex flex-col text-sm lg:my-auto lg:h-full lg:flex-1 lg:flex-row lg:justify-around lg:gap-6 lg:px-8 lg:text-base">
        <div className="px-8 font-shippori lg:flex lg:flex-col">
          <h2 className="text-base text-secondaryHover md:text-xl">
            {room.name}
          </h2>
          <p className="mt-5 text-pretty">{room.info?.description}</p>
          <p className="mt-2 hidden lg:block">
            The accommodation provides an ironing service, as well as business
            facilities like fax and photocopying. Non-stop information is
            available at the reception, where staff speak English, Georgian and
            Russian.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <h3 className="text-lg">Amenities</h3>
            <ul className="grid gap-4 text-sm lg:grid-cols-auto-fill">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CancelRounded className="min-w-6" /> No smoking
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Free WiFi
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Terrace
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Lift
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Private parking
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Air conditioning
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Tea/coffee maker
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <CheckRounded className="min-w-6" /> Daily housekeeping
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
          {!!room.prices && (
            <div className={"flex w-full font-inter lg:items-start lg:pr-6"}>
              <BookingCalendar
                pricesList={room?.prices.list ?? undefined}
                blockedDatesString={room?.blockedDate?.dates ?? undefined}
                roomId={params.id}
              />
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
// {/* <div className="m-auto text-center font-shippori text-base"> */}
//             {/*   Booking for this room is not available. */}
//             {/* </div> */}
//
