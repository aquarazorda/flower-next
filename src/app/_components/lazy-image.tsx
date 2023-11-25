"use client";

import Image from "next/image";
import { ComponentProps, useRef } from "react";
import useOnScreen from "../_hooks/useOnScreen";

export default function LazyImage(props: ComponentProps<typeof Image>) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);

  return <div ref={ref}>{isVisible && <Image {...props} />}</div>;
}
