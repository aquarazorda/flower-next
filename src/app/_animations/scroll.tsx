"use client";

import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export const useScrollUpAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const animation = useAnimation();

  useEffect(() => {
    if (isInView) {
      animation.start("visible");
    }
  }, [isInView]);

  return {
    ref,
    animate: animation,
    initial: "hidden",
    variants: {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    transition: { duration: 0.5 },
  };
};
