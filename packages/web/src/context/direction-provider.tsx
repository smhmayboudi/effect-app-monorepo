"use client";

import { DirectionProvider as RdxDirProvider } from "@radix-ui/react-direction";
import { Option, Schema } from "effect";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

const Direction = Schema.Literal("ltr", "rtl");
export type Direction = typeof Direction.Type;

const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DIRECTION_COOKIE_NAME = "__next_dir";
const DIRECTION_DEFAULT = "ltr";

type DirectionProviderState = {
  defaultDir: Direction;
  dir: Direction;
  resetDir: () => void;
  setDir: (dir: Direction) => void;
};

const initialState: DirectionProviderState = {
  defaultDir: DIRECTION_DEFAULT,
  dir: "ltr",
  resetDir: () => null,
  setDir: () => null,
};

const DirectionContext = createContext<DirectionProviderState>(initialState);

type DirectionProviderProps = {
  defaultDir?: Direction;
  storageKey?: string;
};

export function DirectionProvider({
  children,
  defaultDir = DIRECTION_DEFAULT,
  storageKey = DIRECTION_COOKIE_NAME,
}: PropsWithChildren<DirectionProviderProps>) {
  const [dir, _setDir] = useState<Direction>(() =>
    Option.fromNullable(getCookie(storageKey)).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Direction)),
      Option.getOrElse(() => defaultDir),
    ),
  );

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("dir", dir);
  }, [dir]);

  const setDir = (dir: Direction) => {
    setCookie(storageKey, dir, DIRECTION_COOKIE_MAX_AGE);
    _setDir(dir);
  };

  const resetDir = () => {
    removeCookie(storageKey);
    _setDir(defaultDir);
  };

  return (
    <DirectionContext
      value={{
        defaultDir,
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
