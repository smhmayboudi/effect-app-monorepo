"use client"

import * as Cookies from "@effect/platform/Cookies"
import * as Duration from "effect/Duration"
import * as Either from "effect/Either"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const Theme = Schema.Literal("dark", "light", "system")
export type ResolvedTheme = Exclude<Theme, "system">

export type Theme = typeof Theme.Type

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const THEME_COOKIE_NAME = "__next_theme"
const THEME_DEFAULT = "system"

type ThemeProviderState = {
  defaultTheme: Theme
  resetTheme: () => void
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  theme: Theme
}

const initialState: ThemeProviderState = {
  defaultTheme: THEME_DEFAULT,
  resetTheme: () => null,
  resolvedTheme: "light",
  setTheme: () => null,
  theme: THEME_DEFAULT,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

type ThemeProviderProps = {
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = THEME_DEFAULT,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: PropsWithChildren<ThemeProviderProps>) {
  const [theme, _setTheme] = useState<Theme>(defaultTheme)
  const [isClient, _setIsClient] = useState(false)

  useEffect(() => {
    _setIsClient(true)
    const initialTheme = Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      storageKey,
    ).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Theme)),
      Option.getOrElse(() => defaultTheme),
    )
    _setTheme(initialTheme)
  }, [defaultTheme, storageKey])

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (!isClient) {
      return "light"
    }
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return theme
  }, [theme, isClient])

  useEffect(() => {
    if (!isClient) {
      return
    }
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove("light", "dark")
      root.classList.add(currentResolvedTheme)
    }

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        applyTheme(systemTheme)
      }
    }

    applyTheme(resolvedTheme)

    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, resolvedTheme, isClient])

  const resetTheme = () => {
    if (!isClient) {
      return
    }
    Cookies.makeCookie(storageKey, "", {
      maxAge: Duration.seconds(0),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setTheme(defaultTheme)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setTheme(defaultTheme)
        },
      }),
    )
  }

  const setTheme = (theme: Theme) => {
    if (!isClient) {
      return
    }

    Cookies.makeCookie(storageKey, theme, {
      maxAge: Duration.seconds(THEME_COOKIE_MAX_AGE),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setTheme(theme)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setTheme(theme)
        },
      }),
    )
  }

  const contextValue = {
    defaultTheme,
    resetTheme,
    resolvedTheme,
    setTheme,
    theme,
  }

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
