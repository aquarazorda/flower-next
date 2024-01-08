export const err = <T>(val: T) => ({
  err: true,
  ok: false,
  val,
});

export const ok = <T>(val: T) => ({
  err: false,
  ok: true,
  val,
});
