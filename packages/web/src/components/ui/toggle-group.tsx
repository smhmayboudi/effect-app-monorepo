"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, useContext } from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = createContext<
  VariantProps<typeof toggleVariants> & { direction?: "ltr" | "rtl" }
>({
  direction: "ltr",
  size: "default",
  variant: "default",
});

function ToggleGroup({
  children,
  className,
  direction,
  size,
  variant,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    direction?: "ltr" | "rtl";
  }) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className,
      )}
      data-direction={direction}
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      dir={direction}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ direction, size, variant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  children,
  className,
  size,
  variant,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          size: context.size || size,
          variant: context.variant || variant,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none focus:z-10 focus-visible:z-10",
        context.direction === "rtl"
          ? "first:rounded-r-md last:rounded-l-md data-[variant=outline]:border-r-0 data-[variant=outline]:first:border-r"
          : "first:rounded-l-md last:rounded-r-md data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      data-direction={context.direction}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
