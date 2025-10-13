"use client";

import { Option, Schema } from "effect";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

const Collapsible = Schema.Literal("icon", "none", "offcanvas");
export type Collapsible = typeof Collapsible.Type;

const Variant = Schema.Literal("floating", "inset", "sidebar");
export type Variant = typeof Variant.Type;

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "__next_layout_collapsible";
const LAYOUT_COLLAPSIBLE_DEFAULT = "icon";
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const LAYOUT_VARIANT_COOKIE_NAME = "__next_layout_variant";
const LAYOUT_VARIANT_DEFAULT = "inset";

type LayoutContextType = {
  collapsible: Collapsible;
  defaultCollapsible: Collapsible;
  defaultVariant: Variant;
  resetLayout: () => void;
  setCollapsible: (collapsible: Collapsible) => void;
  setVariant: (variant: Variant) => void;
  variant: Variant;
};

const initialState: LayoutContextType = {
  collapsible: "icon",
  defaultCollapsible: LAYOUT_COLLAPSIBLE_DEFAULT,
  defaultVariant: LAYOUT_VARIANT_DEFAULT,
  resetLayout: () => null,
  setCollapsible: () => null,
  setVariant: () => null,
  variant: "inset",
};

const LayoutContext = createContext<LayoutContextType>(initialState);

type LayoutProviderProps = {
  defaultCollapsible: Collapsible;
  defaultVariant?: Variant;
  storageKeyCollapsible?: string;
  storageKeyVariant?: string;
};

export function LayoutProvider({
  children,
  defaultCollapsible = LAYOUT_COLLAPSIBLE_DEFAULT,
  defaultVariant = LAYOUT_VARIANT_DEFAULT,
  storageKeyCollapsible = LAYOUT_COLLAPSIBLE_COOKIE_NAME,
  storageKeyVariant = LAYOUT_VARIANT_COOKIE_NAME,
}: PropsWithChildren<LayoutProviderProps>) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() =>
    Option.fromNullable(getCookie(storageKeyCollapsible)).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Collapsible)),
      Option.getOrElse(() => defaultCollapsible),
    ),
  );

  const [variant, _setVariant] = useState<Variant>(() =>
    Option.fromNullable(getCookie(storageKeyVariant)).pipe(
      Option.flatMap(Schema.decodeUnknownOption(Variant)),
      Option.getOrElse(() => defaultVariant),
    ),
  );

  const setCollapsible = (newCollapsible: Collapsible) => {
    setCookie(storageKeyCollapsible, newCollapsible, LAYOUT_COOKIE_MAX_AGE);
    _setCollapsible(newCollapsible);
  };

  const setVariant = (newVariant: Variant) => {
    setCookie(storageKeyVariant, newVariant, LAYOUT_COOKIE_MAX_AGE);
    _setVariant(newVariant);
  };

  const resetLayout = () => {
    removeCookie(storageKeyCollapsible);
    removeCookie(storageKeyVariant);
    setCollapsible(defaultCollapsible);
    setVariant(defaultVariant);
  };

  const contextValue: LayoutContextType = {
    collapsible,
    defaultCollapsible,
    defaultVariant,
    resetLayout,
    setCollapsible,
    setVariant,
    variant,
  };

  return <LayoutContext value={contextValue}>{children}</LayoutContext>;
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
}
