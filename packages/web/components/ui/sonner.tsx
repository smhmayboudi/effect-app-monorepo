"use client";

import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const locale = useLocale();

  return (
    <Sonner
      className="toaster group"
      position={locale === "fa" ? "bottom-left" : "bottom-right"}
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
