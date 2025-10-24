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
  useState,
} from "react"

const Collapsible = Schema.Literal("icon", "none", "offcanvas")
export type Collapsible = typeof Collapsible.Type

const Variant = Schema.Literal("floating", "inset", "sidebar")
export type Variant = typeof Variant.Type

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "__next_layout_collapsible"
const LAYOUT_COLLAPSIBLE_DEFAULT = "icon"
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const LAYOUT_VARIANT_COOKIE_NAME = "__next_layout_variant"
const LAYOUT_VARIANT_DEFAULT = "inset"

type LayoutContextType = {
  collapsible: Collapsible
  defaultCollapsible: Collapsible
  defaultVariant: Variant
  resetLayout: () => void
  setCollapsible: (collapsible: Collapsible) => void
  setVariant: (variant: Variant) => void
  variant: Variant
}

const initialState: LayoutContextType = {
  collapsible: "icon",
  defaultCollapsible: LAYOUT_COLLAPSIBLE_DEFAULT,
  defaultVariant: LAYOUT_VARIANT_DEFAULT,
  resetLayout: () => null,
  setCollapsible: () => null,
  setVariant: () => null,
  variant: "inset",
}

const LayoutContext = createContext<LayoutContextType>(initialState)

type LayoutProviderProps = {
  defaultCollapsible?: Collapsible
  defaultVariant?: Variant
  storageKeyCollapsible?: string
  storageKeyVariant?: string
}

export function LayoutProvider({
  children,
  defaultCollapsible = LAYOUT_COLLAPSIBLE_DEFAULT,
  defaultVariant = LAYOUT_VARIANT_DEFAULT,
  storageKeyCollapsible = LAYOUT_COLLAPSIBLE_COOKIE_NAME,
  storageKeyVariant = LAYOUT_VARIANT_COOKIE_NAME,
}: PropsWithChildren<LayoutProviderProps>) {
  const [collapsible, _setCollapsible] =
    useState<Collapsible>(defaultCollapsible)
  const [variant, _setVariant] = useState<Variant>(defaultVariant)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const initialCollapsible = Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      storageKeyCollapsible,
    ).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Collapsible)),
      Option.getOrElse(() => defaultCollapsible),
    )
    const initialVariant = Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      storageKeyVariant,
    ).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Variant)),
      Option.getOrElse(() => defaultVariant),
    )
    _setCollapsible(initialCollapsible)
    _setVariant(initialVariant)
  }, [
    defaultCollapsible,
    defaultVariant,
    storageKeyCollapsible,
    storageKeyVariant,
  ])

  const setCollapsible = (newCollapsible: Collapsible) => {
    if (!isClient) {
      return
    }
    Cookies.makeCookie(storageKeyCollapsible, newCollapsible, {
      maxAge: Duration.seconds(LAYOUT_COOKIE_MAX_AGE),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setCollapsible(newCollapsible)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setCollapsible(newCollapsible)
        },
      }),
    )
  }

  const setVariant = (newVariant: Variant) => {
    if (!isClient) {
      return
    }
    Cookies.makeCookie(storageKeyVariant, newVariant, {
      maxAge: Duration.seconds(LAYOUT_COOKIE_MAX_AGE),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setVariant(newVariant)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setVariant(newVariant)
        },
      }),
    )
  }

  const resetLayout = () => {
    if (!isClient) {
      return
    }
    Cookies.makeCookie(storageKeyCollapsible, "", {
      maxAge: Duration.seconds(0),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setCollapsible(defaultCollapsible)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setCollapsible(defaultCollapsible)
        },
      }),
    )
    Cookies.makeCookie(storageKeyVariant, "", {
      maxAge: Duration.seconds(0),
      path: "/",
    }).pipe(
      Either.match({
        onLeft: (left) => {
          console.error("Cookie creation failed:", left)
          _setVariant(defaultVariant)
        },
        onRight: (right) => {
          document.cookie = Cookies.serializeCookie(right)
          _setVariant(defaultVariant)
        },
      }),
    )
  }

  const contextValue: LayoutContextType = {
    collapsible,
    defaultCollapsible,
    defaultVariant,
    resetLayout,
    setCollapsible,
    setVariant,
    variant,
  }

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }

  return context
}
