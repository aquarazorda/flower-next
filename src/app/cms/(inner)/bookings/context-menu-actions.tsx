"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "~/app/_components/ui/context-menu";
import { deleteReservation } from "./actions";
import { toast } from "~/app/_components/ui/use-toast";
import { useCallback } from "react";

type Props = {
  id: string;
};

export const ReservartionContextMenuActions = ({ id }: Props) => {
  const onClick = useCallback(async () => {
    const res = await deleteReservation(id);
    if (res.err) {
      toast({
        description: "Couldn't delete reservation",
      });
    } else {
      toast({
        description: "Reservation successfully deleted",
      });
    }
  }, [id]);

  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={onClick} className="cursor-pointer">
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
