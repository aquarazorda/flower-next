export type Either<L, R> = Left<L> | Right<R>;

type Left<L> = {
  err: true;
  ok: false;
  val: L;
};

type Right<R> = {
  err: false;
  ok: true;
  val: R;
};

export const err = <T>(val: T): Left<T> =>
  ({
    err: true,
    ok: false,
    val,
  }) as const;

export const ok = <T>(val: T): Right<T> =>
  ({
    err: false,
    ok: true,
    val,
  }) as const;
