import Link from "next/link";
import headerNavItems from "./headerNavItems";

export const MobileHeader = () => {
  return (
    <div className="sticky top-0 z-50 flex flex-col bg-white/75 shadow-gray-500 backdrop-blur transition-all duration-300 ease-in-out lg:hidden">
      <div className="mt-4 flex w-full justify-center">
        <Link className="w-1/4 text-center transition-all" href="/">
          <h1 className="text-xl uppercase leading-5">Hotel Flower</h1>
        </Link>
      </div>
      <nav className="mb-4 mt-7 flex w-full justify-evenly px-4 font-shippori text-sm uppercase">
        {headerNavItems.map((item) => (
          <div className="flex-1 text-center" key={item.name}>
            <Link href={item.path}>{item.name}</Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MobileHeader;
