import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { api } from "~/trpc/server";
import { RoomRowList } from "./row";

export default async function CMSDashboardPage() {
  const data = await api.room.get.query();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room number</TableHead>
          <TableHead>Room name</TableHead>
          <TableHead>Room id</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <RoomRowList rooms={data} />
      </TableBody>
    </Table>
  );
}
