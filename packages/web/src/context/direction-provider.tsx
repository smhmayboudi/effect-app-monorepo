"use client";

import { DirectionProvider as RdxDirProvider } from "@radix-ui/react-direction";
import { createContext, useContext, useEffect, useState } from "react";

import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

export type Direction = "ltr" | "rtl";

const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DIRECTION_COOKIE_NAME = "__next_dir";
const DIRECTION_DEFAULT = "ltr";

type DirectionContextType = {
  defaultDir: Direction;
  dir: Direction;
  resetDir: () => void;
  setDir: (dir: Direction) => void;
};

const DirectionContext = createContext<DirectionContextType | null>(null);

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(
    () => (getCookie(DIRECTION_COOKIE_NAME) as Direction) || DIRECTION_DEFAULT,
  );

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("dir", dir);
  }, [dir]);

  const setDir = (dir: Direction) => {
    _setDir(dir);
    setCookie(DIRECTION_COOKIE_NAME, dir, DIRECTION_COOKIE_MAX_AGE);
  };

  const resetDir = () => {
    _setDir(DIRECTION_DEFAULT);
    removeCookie(DIRECTION_COOKIE_NAME);
  };

  return (
    <DirectionContext
      value={{
        defaultDir: DIRECTION_DEFAULT,
        dir,
        resetDir,
        setDir,
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
