"use client";

import { useTheme } from "@/context/theme-provider";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "[dir='ltr'] &": {
            right: "0",
            bottom: "0",
          },
          "[dir='rtl'] &": {
            left: "0",
            bottom: "0",
          },
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
