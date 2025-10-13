"use client";

import { Option, Schema } from "effect";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

const Theme = Schema.Literal("dark", "light", "system");
export type ResolvedTheme = Exclude<Theme, "system">;

export type Theme = typeof Theme.Type;

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const THEME_COOKIE_NAME = "__next_theme";
const THEME_DEFAULT = "system";

type ThemeProviderState = {
  defaultTheme: Theme;
  resetTheme: () => void;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

const initialState: ThemeProviderState = {
  defaultTheme: THEME_DEFAULT,
  resetTheme: () => null,
  resolvedTheme: "light",
  setTheme: () => null,
  theme: THEME_DEFAULT,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

type ThemeProviderProps = {
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = THEME_DEFAULT,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: PropsWithChildren<ThemeProviderProps>) {
  const [theme, _setTheme] = useState<Theme>(() =>
    Option.fromNullable(getCookie(storageKey)).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Theme)),
      Option.getOrElse(() => defaultTheme),
    ),
  );

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove("light", "dark");
      root.classList.add(currentResolvedTheme);
    };

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(systemTheme);
      }
    };

    applyTheme(resolvedTheme);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolvedTheme]);

  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE);
    _setTheme(theme);
  };

  const resetTheme = () => {
    removeCookie(storageKey);
    _setTheme(defaultTheme);
  };

  const contextValue = {
    defaultTheme,
    resetTheme,
    resolvedTheme,
    setTheme,
    theme,
  };

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
