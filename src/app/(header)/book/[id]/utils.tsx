import { getDiscountedPrice } from "~/app/_lib/prices";

type Props = {
  price: number;
  salePercent?: number;
};

export const DisplayPrice = ({ price, salePercent }: Props) => {
  return (
    <p className="mt-6 flex w-full justify-between text-secondary">
      Total Price{" "}
      <span className="flex gap-2">
        {/* {!!price && salePercent && ( */}
        {/*   <span className="line-through">{price}</span> */}
        {/* )} */}
        {/* <span className="text-faily"> */}
        {/*   {salePercent ? getDiscountedPrice(price, salePercent) : price || 0} */}
        {/* </span>{" "} */}
        <span className="text-faily">{price ?? 0}</span> (GEL)
      </span>
    </p>
  );
};
