import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";

export default async function CMSRoomPage() {
  return (
    <Tabs
      defaultValue="information"
      className="flex w-full flex-col items-center p-3"
    >
      <TabsList className="w-fit">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="prices">Prices</TabsTrigger>
        <TabsTrigger value="pictures">Pictures</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}
