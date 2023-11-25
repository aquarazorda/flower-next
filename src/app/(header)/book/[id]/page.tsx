import { api } from "~/trpc/server";
import Image from "next/image";
import RoomSlider from "./slider";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CancelRounded } from "~/app/_assets/icons/CancelRounded";
import { CheckRounded } from "~/app/_assets/icons/CheckRounded";

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
          url: `https://flowertbilisi.com/images/${data?.roomId}/${data?.info?.pictures?.[0]}-og.jpg`,
          width: 800,
          height: 600,
        },
        {
          // @ts-ignore
          url: `https://flowertbilisi.com/images/${data?.roomId}/${data?.info?.pictures[0]}-og-alt.jpg`,
          width: 1800,
          height: 1600,
          alt: data?.name,
        },
      ],
    },
    twitter: {
      title: `Hotel Flower - ${data?.name}`,
      description: data?.info?.description || "",
      card: "summary_large_image",
      images: [
        // @ts-ignore
        `https://flowertbilisi.com/images/${data?.roomId}/${data?.info?.pictures?.[0]}-og.jpg`,
      ],
    },
  };
}

export default async function RoomItemPage({ params }: Props) {
  const room = await api.room.getRoom.query(params.id);

  if (!room) {
    return redirect("/book");
  }

  return (
    <main className="mb-10 flex flex-col gap-6 text-xs text-neutral-500 lg:mb-0 lg:flex-row">
      <RoomSlider
        pictures={room.info?.pictures as string[]}
        roomId={room.roomId}
        name={room.name}
      />
      <div className="flex flex-col px-8 lg:mb-40 lg:flex-1 lg:flex-row lg:justify-around lg:px-0 lg:pt-20">
        <div className="font-shippori lg:my-auto lg:flex lg:w-2/5 lg:flex-col">
          <h2 className="text-lg text-secondaryHover">{room.name}</h2>
          <p className="mt-5">{room.info?.description} </p>
          <p className="mt-2 hidden lg:block">
            The accommodation provides an ironing service, as well as business
            facilities like fax and photocopying. Non-stop information is
            available at the reception, where staff speak English, Georgian and
            Russian.
          </p>

          <div className="mt-10 flex flex-col gap-4 px-6 lg:px-0">
            <h3 className="text-base">Amenities</h3>
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
            <div className="flex h-full flex-col justify-center">
              {/* <DatePicker */}
              {/*   inline */}
              {/*   mode="range" */}
              {/*   minDate={new Date()} */}
              {/*   maxDate={maxDate()} */}
              {/*   onChange={onCalendarChange} */}
              {/*   dateFormat="Y-m-d" */}
              {/*   isLoading={room.isLoading} */}
              {/*   disable={room.blockedDate?.dates || []} */}
              {/* /> */}
              {/* <div className="px-2"> */}
              {/*   <p className="mt-6 flex w-full justify-between"> */}
              {/*     Total Price{" "} */}
              {/*     <span> */}
              {/*       <span className="text-faily">{price() || 0}</span> (GEL) */}
              {/*     </span> */}
              {/*   </p> */}
              {/*   <Button */}
              {/*     className="mt-8 text-xs" */}
              {/*     disabled={!dateValues()?.length} */}
              {/*     onClick={() => setBookingOpen(true)} */}
              {/*   > */}
              {/*     Book Now */}
              {/*   </Button> */}
              {/*   <p className="mt-10 w-full text-left"> */}
              {/*     Pay now and get 5% discount */}
              {/*   </p> */}
              {/* </div> */}
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
