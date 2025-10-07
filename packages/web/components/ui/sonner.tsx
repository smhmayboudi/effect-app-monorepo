"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isRTL =
    typeof document !== "undefined"
      ? document.documentElement.dir === "rtl"
      : false;

  return (
    <Sonner
      className="toaster group"
      position={isRTL ? "bottom-left" : "bottom-right"}
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
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  );
};

export { Toaster };
