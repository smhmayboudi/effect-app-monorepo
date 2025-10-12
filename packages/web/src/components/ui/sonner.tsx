"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

import { useTheme } from "@/context/theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
          "[dir='ltr'] &": {
            bottom: "0",
            right: "0",
          },
          "[dir='rtl'] &": {
            bottom: "0",
            left: "0",
          },
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  );
};

export { Toaster };
