import { cn } from "../_lib/_utils";

type Props = {
  count: number | any[];
  current: number;
  moveTo?: (idx: number) => void;
};

export default function SliderDots(props: Props) {
  return (
    <>
      {Array.from(Array(props.count).keys()).map((room, idx) => (
        <div
          key={`${room.roomId}-${idx}-dot`}
          className={cn(
            "h-2 w-2 cursor-pointer rounded-full hover:bg-neutral-400",
            idx === props.current && "bg-neutral-400",
            idx !== props.current && "bg-zinc-300",
          )}
          onClick={() => props.moveTo?.(idx)}
        />
      ))}
    </>
  );
}
