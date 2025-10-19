import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { useDirection } from "@/context/direction-provider";
import { cn } from "@/lib/utils";

const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {}
>(({ children, className, ...props }, ref) => {
  const { dir } = useDirection();

  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      dir={dir}
      ref={ref}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & {}
>(({ className, ...props }, ref) => {
  const { dir } = useDirection();

  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        { "space-x-reverse": dir === "rtl" },
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent",
);

const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {}
>(({ children, className, ...props }, ref) => {
  const { dir } = useDirection();

  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      ref={ref}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "relative top-[1px] ms-1 size-3 transition duration-300",
          dir === "rtl" ? "group-data-[state=open]:-rotate-180" : "group-data-[state=open]:rotate-180",
        )}
      />
    </NavigationMenuPrimitive.Trigger>
  );
});
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & {}
>(({ className, ...props }, ref) => {
  const { dir } = useDirection();

  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "end-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
        dir === "rtl"
          ? "data-[motion=from-end]:slide-in-from-left-52 data-[motion=from-start]:slide-in-from-right-52 data-[motion=to-end]:slide-out-to-left-52 data-[motion=to-start]:slide-out-to-right-52"
          : "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {}
>(({ className, ...props }, ref) => (
  <div className="absolute start-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
      className,
    )}
    ref={ref}
    {...props}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};
