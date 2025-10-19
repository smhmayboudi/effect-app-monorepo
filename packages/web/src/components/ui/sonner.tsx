"use client";

import type { CSSProperties } from "react";

import { Toaster as Sonner, ToasterProps } from "sonner";

import { useDirection } from "@/context/direction-provider";
import { useTheme } from "@/context/theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const { dir } = useDirection();

  return (
    <Sonner
      className="toaster group"
      position={dir === "rtl" ? "bottom-left" : "bottom-right"}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  );
};

export { Toaster };
