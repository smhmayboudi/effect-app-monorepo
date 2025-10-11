"use client";

import { getCookie, setCookie } from "@/lib/cookies";
import { createContext, useContext, useState } from "react";

export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "__next_layout_collapsible";
const LAYOUT_COLLAPSIBLE_DEFAULT = "icon";
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const LAYOUT_VARIANT_COOKIE_NAME = "__next_layout_variant";
const LAYOUT_VARIANT_DEFAULT = "inset";

type LayoutContextType = {
  resetLayout: () => void;
  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;
  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    return (
      (getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME) as Collapsible) ||
      LAYOUT_COLLAPSIBLE_DEFAULT
    );
  });

  const [variant, _setVariant] = useState<Variant>(() => {
    return (
      (getCookie(LAYOUT_VARIANT_COOKIE_NAME) as Variant) ||
      LAYOUT_VARIANT_DEFAULT
    );
  });

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible);
    setCookie(
      LAYOUT_COLLAPSIBLE_COOKIE_NAME,
      newCollapsible,
      LAYOUT_COOKIE_MAX_AGE,
    );
  };

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE);
  };

  const resetLayout = () => {
    setCollapsible(LAYOUT_COLLAPSIBLE_DEFAULT);
    setVariant(LAYOUT_VARIANT_DEFAULT);
  };

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: LAYOUT_COLLAPSIBLE_DEFAULT,
    collapsible,
    setCollapsible,
    defaultVariant: LAYOUT_VARIANT_DEFAULT,
    variant,
    setVariant,
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
