import Image from "next/image";

export default function Restaurant() {
  return (
    <div className="mt-14 text-xs lg:mt-32">
      <h5 className="mb-8 text-center text-base font-medium text-primary lg:mb-16 lg:text-2xl lg:font-normal">
        Restaurant
      </h5>
      <div className="relative h-28 w-full lg:m-auto lg:h-60 lg:px-32">
        <Image
          src="/images/home/restaurant-desktop.webp"
          alt="Restaurant banner"
          fill={true}
          className="h-full  w-full rounded-md object-cover"
          loading="lazy"
        />
      </div>
      <span className="block px-5 pb-16 pt-12 text-center text-primary lg:px-0 lg:py-36 lg:pt-20 lg:text-base lg:text-primary/90">
        <span className="text-[12.5px] lg:mx-auto lg:block lg:max-w-2xl lg:text-base lg:text-primary/90">
          Savor exquisite meals at our skyline restaurant, offering a culinary
          journey as breathtaking as the city views. Dine under the stars, enjoy
          the shimmering city lights, and experience flavors that will tantalize
          your taste buds. Elevate your dining experience. Welcome to our
          cityscape haven!
        </span>
      </span>
    </div>
  );
}
