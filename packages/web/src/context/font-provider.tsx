"use client";

import { getCookie, setCookie, removeCookie } from "@/lib/cookies";
import { createContext, useContext, useEffect, useState } from "react";

const fonts = ["inter", "manrope", "system"] as const;
type Font = (typeof fonts)[number];

const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FONT_COOKIE_NAME = "__next_font";

type FontContextType = {
  resetFont: () => void;
  defaultFornt: Font;
  font: Font;
  setFont: (font: Font) => void;
};

const FontContext = createContext<FontContextType | null>(null);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, _setFont] = useState<Font>(() => {
    const savedFont = getCookie(FONT_COOKIE_NAME);
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0];
  });

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
    setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE);
    _setFont(font);
  };

  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME);
    _setFont(fonts[0]);
  };

  return (
    <FontContext value={{ resetFont, defaultFornt: fonts[0], font, setFont }}>
      {children}
    </FontContext>
  );
}

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
