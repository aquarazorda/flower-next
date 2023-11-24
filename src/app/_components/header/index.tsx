"use client";

import { lazy } from "react";

const HeaderDesktop = lazy(() => import("./desktop"));
const HeaderMobile = lazy(() => import("./mobile"));

export const Header = () => {
  return (
    <>
      <HeaderMobile />
      <HeaderDesktop />
    </>
  );
};
