import { Metadata } from "next";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import login from "./handler";

export const metadata: Metadata = {
  title: "Hotel Flower - CMS Login",
};

export default function CMSLoginPage() {
  return (
    <div className="flex h-screen w-screen items-center lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
        </div>
        <form className="flex flex-col space-y-2" action={login}>
          <Input name="username" placeholder="Username" autoFocus />
          <Input name="password" placeholder="Password" type="password" />
          <Button type="submit">Log in</Button>
        </form>
      </div>
    </div>
  );
}
