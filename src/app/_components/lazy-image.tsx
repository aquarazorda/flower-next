"use client";

import Image from "next/image";
import { ComponentProps, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyImage(props: ComponentProps<typeof Image>) {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  return <div ref={ref}>{inView && <Image {...props} />}</div>;
}
