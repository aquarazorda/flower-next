export const getDiscountedPrice = (price: number, discount: number) => {
  return Math.ceil(price - (price * discount) / 100);
};

export const getOriginalPrice = (price: number, discount: number) => {
  return Math.ceil((price * 100) / (100 - discount));
};
