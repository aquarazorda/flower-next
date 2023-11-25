"use client";

import { useEffect, useMemo, useState } from "react";

export const useIsMobile = () => {
  const [width, setWidth] = useState<number>(1024);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return useMemo(() => width < 1024, [width]);
};
