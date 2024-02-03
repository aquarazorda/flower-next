import { zfd } from "zod-form-data";
import { z } from "zod";
import { ButtonLoader } from "~/app/_components/ui/button-loader";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Textarea } from "~/app/_components/ui/textarea";
import { RouterOutputs } from "~/trpc/shared";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

type Props = {
  room: RouterOutputs["room"]["getRoom"];
};

export default function EditRoomInformation({ room }: Props) {
  if (!room) {
    return redirect("/cms/room");
  }

  const saveInfo = async (formData: FormData) => {
    "use server";
    const schema = zfd.formData({
      persons: zfd.numeric(z.number().positive()),
      description: zfd.text(),
      extraPerson: zfd.checkbox(),
      msId: zfd.numeric(z.number().positive()),
    });

    const data = schema.safeParse(formData);

    if (data.success) {
      await db.roomInfo.update({
        where: {
          roomId: room.roomId,
        },
        data: {
          ...data.data,
          updatedAt: new Date(),
        },
      });
    }

    revalidatePath(`/cms/room/${room.id}`);
  };

  return (
    <form
      className="mt-2 flex flex-col gap-6 bg-slate-100 p-6"
      action={saveInfo}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="persons">Persons</Label>
        <Input
          type="number"
          id="persons"
          name="persons"
          defaultValue={room?.info?.persons || 0}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="persons">Room ID</Label>
        <Input
          type="number"
          id="msId"
          name="msId"
          defaultValue={room?.info?.msId || 0}
        />
      </div>
      <Textarea
        name="description"
        placeholder="Enter room description"
        rows={10}
        defaultValue={room?.info?.description || ""}
      />
      <div className="items-top flex space-x-2">
        <Checkbox
          id="extraPerson"
          name="extraPerson"
          defaultChecked={room?.info?.extraPerson}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="extraPerson"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Extra person
          </label>
          <p className="text-muted-foreground text-sm">
            Enable this if room can accomodate one more person
          </p>
        </div>
      </div>
      <ButtonLoader variant="default">Save</ButtonLoader>
    </form>
  );
}
