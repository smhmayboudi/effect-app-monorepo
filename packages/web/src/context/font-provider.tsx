"use client";

import { Cookies } from "@effect/platform";
import { Duration, Either, Option, Schema } from "effect";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const Font = Schema.Literal("inter", "manrope", "system");
export type Font = typeof Font.Type;

const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FONT_COOKIE_NAME = "__next_font";
const FONT_DEFAULT = "inter";

type FontProviderState = {
  defaultFont: Font;
  font: Font;
  resetFont: () => void;
  setFont: (font: Font) => void;
};

const initialState: FontProviderState = {
  defaultFont: FONT_DEFAULT,
  font: "inter",
  resetFont: () => null,
  setFont: () => null,
};

const FontContext = createContext<FontProviderState>(initialState);

type FontProviderProps = {
  defaultFont?: Font;
  storageKey?: string;
};

export function FontProvider({
  children,
  defaultFont = FONT_DEFAULT,
  storageKey = FONT_COOKIE_NAME,
}: PropsWithChildren<FontProviderProps>) {
  const [font, _setFont] = useState<Font>(() =>
    Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      storageKey,
    ).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Font)),
      Option.getOrElse(() => defaultFont),
    ),
  );

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith("font-")) root.classList.remove(cls);
      });
      root.classList.add(`font-${font}`);
    };

    applyFont(font);
  }, [font]);

  const setFont = (font: Font) => {
    Cookies.makeCookie(storageKey, font, {
      maxAge: Duration.seconds(FONT_COOKIE_MAX_AGE),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left);
          _setFont(font);
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right);
          _setFont(font);
        },
      }),
    );
  };

  const resetFont = () => {
    Cookies.makeCookie(storageKey, "", {
      maxAge: Duration.seconds(0),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left);
          _setFont(defaultFont);
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right);
          _setFont(defaultFont);
        },
      }),
    );
  };

  return (
    <FontContext value={{ defaultFont, font, resetFont, setFont }}>
      {children}
    </FontContext>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }

  return context;
}
