"use client";

import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twc } from "@/util/css";

const button = cva("btn", {
  variants: {
    c_behavior: {
      active: "btn-active",
      disabled: "btn-disabled",
    },
    c_color: {
      neutral: "btn-neutral",
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      info: "btn-info",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
    },
    c_modifier: {
      wide: "btn-wide",
      block: "btn-block",
      square: "btn-square",
      circle: "btn-circle",
    },
    c_size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      xl: "btn-xl",
    },
    c_style: {
      outline: "btn-outline",
      dash: "btn-dash",
      soft: "btn-soft",
      ghost: "btn-ghost",
      link: "btn-link",
    },
  },
  compoundVariants: [],
  defaultVariants: {},
});
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export default function Button({
  c_behavior,
  c_color,
  c_modifier,
  c_size,
  c_style,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twc(
        button({ c_behavior, c_color, c_modifier, c_size, c_style }),
        className
      )}
      {...props}
    />
  );
}
