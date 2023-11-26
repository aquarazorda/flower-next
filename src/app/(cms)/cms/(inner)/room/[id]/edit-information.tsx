import { Button } from "~/app/_components/ui/button";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Textarea } from "~/app/_components/ui/textarea";
import { RouterOutputs } from "~/trpc/shared";

type Props = {
  room: RouterOutputs["room"]["getRoom"];
};

export default function EditRoomInformation({ room }: Props) {
  return (
    <form className="mt-2 flex flex-col gap-6 bg-slate-100 p-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="persons">Persons</Label>
        <Input
          type="number"
          id="persons"
          defaultValue={room?.info?.persons || 0}
        />
      </div>
      <Textarea
        placeholder="Enter room description"
        rows={10}
        defaultValue={room?.info?.description || ""}
      />
      <div className="items-top flex space-x-2">
        <Checkbox id="extraPerson" defaultChecked={room?.info?.extraPerson} />
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
      <Button variant="default">Save</Button>
    </form>
  );
}
