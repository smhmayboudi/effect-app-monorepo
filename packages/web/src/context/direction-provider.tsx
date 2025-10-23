"use client";

import * as Cookies from "@effect/platform/Cookies";
import { DirectionProvider as RdxDirProvider } from "@radix-ui/react-direction";
import * as Duration from "effect/Duration";
import * as Either from "effect/Either";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [dir, _setDir] = useState<Direction>(defaultDir);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialDir = Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      storageKey,
    ).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Direction)),
      Option.getOrElse(() => defaultDir),
    );
    _setDir(initialDir);
  }, [defaultDir, storageKey]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const htmlElement = document.documentElement;
    htmlElement.setAttribute("dir", dir);
  }, [dir, isClient]);

  const setDir = (dir: Direction) => {
    if (!isClient) {
      return;
    }
    Cookies.makeCookie(storageKey, dir, {
      maxAge: Duration.seconds(DIRECTION_COOKIE_MAX_AGE),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left);
          _setDir(dir);
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right);
          _setDir(dir);
        },
      }),
    );
  };

  const resetDir = () => {
    if (!isClient) {
      return;
    }
    Cookies.makeCookie(storageKey, "", {
      maxAge: Duration.seconds(0),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left);
          _setDir(defaultDir);
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right);
          _setDir(defaultDir);
        },
      }),
    );
  };

  return (
    <DirectionContext.Provider
      value={{
        defaultDir,
        dir,
        resetDir,
        setDir,
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }

  return context;
}
