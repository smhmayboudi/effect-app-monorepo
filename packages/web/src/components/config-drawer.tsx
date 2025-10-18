import type { SVGProps } from "react";

import { Item, Root as Radio } from "@radix-ui/react-radio-group";
import { CircleCheck, RotateCcw, Settings } from "lucide-react";

import { IconDir } from "@/assets/custom/icon-dir";
import { IconLayoutCompact } from "@/assets/custom/icon-layout-compact";
import { IconLayoutDefault } from "@/assets/custom/icon-layout-default";
import { IconLayoutFull } from "@/assets/custom/icon-layout-full";
import { IconSidebarFloating } from "@/assets/custom/icon-sidebar-floating";
import { IconSidebarInset } from "@/assets/custom/icon-sidebar-inset";
import { IconSidebarSidebar } from "@/assets/custom/icon-sidebar-sidebar";
import { IconThemeDark } from "@/assets/custom/icon-theme-dark";
import { IconThemeLight } from "@/assets/custom/icon-theme-light";
import { IconThemeSystem } from "@/assets/custom/icon-theme-system";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirection } from "@/context/direction-provider";
import { type Collapsible, useLayout } from "@/context/layout-provider";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetDir } = useDirection();
  const { resetTheme } = useTheme();
  const { resetLayout } = useLayout();

  const handleReset = () => {
    setOpen(true);
    resetDir();
    resetTheme();
    resetLayout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-describedby="config-drawer-description"
          aria-label="Open theme settings"
          size="icon"
          variant="ghost"
        >
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col" side="right">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            aria-label="Reset all settings to default values"
            onClick={handleReset}
            variant="destructive"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection();

  return (
    <div>
      <SectionTitle
        onReset={() => setDir(defaultDir)}
        showReset={defaultDir !== dir}
        title="Direction"
      />
      <Radio
        aria-describedby="direction-description"
        aria-label="Select site direction"
        className="grid w-full max-w-md grid-cols-3 gap-4"
        onValueChange={setDir}
        value={dir}
      >
        {[
          {
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="ltr" {...props} />
            ),
            label: "Left to Right",
            value: "ltr",
          },
          {
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="rtl" {...props} />
            ),
            label: "Right to Left",
            value: "rtl",
          },
        ].map((item) => (
          <RadioGroupItem item={item} key={item.value} />
        ))}
      </Radio>
      <div className="sr-only" id="direction-description">
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  );
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar();
  const { collapsible, defaultCollapsible, setCollapsible } = useLayout();

  const radioState = open ? "default" : collapsible;

  return (
    <div className="max-md:hidden">
      <SectionTitle
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
        showReset={radioState !== "default"}
        title="Layout"
      />
      <Radio
        aria-describedby="layout-description"
        aria-label="Select layout style"
        className="grid w-full max-w-md grid-cols-3 gap-4"
        onValueChange={(v) => {
          if (v === "default") {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as Collapsible);
        }}
        value={radioState}
      >
        {[
          {
            icon: IconLayoutDefault,
            label: "Default",
            value: "default",
          },
          {
            icon: IconLayoutCompact,
            label: "Compact",
            value: "icon",
          },
          {
            icon: IconLayoutFull,
            label: "Full layout",
            value: "offcanvas",
          },
        ].map((item) => (
          <RadioGroupItem item={item} key={item.value} />
        ))}
      </Radio>
      <div className="sr-only" id="layout-description">
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  );
}

function RadioGroupItem({
  isTheme = false,
  item,
}: {
  isTheme?: boolean;
  item: {
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
    label: string;
    value: string;
  };
}) {
  const { dir } = useDirection();

  return (
    <Item
      aria-describedby={`${item.value}-description`}
      aria-label={`Select ${item.label.toLowerCase()}`}
      className="group transition duration-200 ease-in outline-none"
      value={item.value}
    >
      <div
        aria-hidden="false"
        aria-label={`${item.label} option preview`}
        className="relative rounded-[6px] ring-[1px] ring-border group-focus-visible:ring-2 group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary"
        role="img"
      >
        <CircleCheck
          aria-hidden="true"
          className={cn(
            "absolute end-0 top-0 size-6 -translate-y-1/2 fill-primary stroke-white group-data-[state=unchecked]:hidden",
            dir === "rtl" ? "-translate-x-1/2" : "translate-x-1/2",
          )}
        />
        <item.icon
          aria-hidden="true"
          className={
            isTheme
              ? ""
              : "fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground"
          }
        />
      </div>
      <div
        aria-live="polite"
        className="mt-1 text-xs"
        id={`${item.value}-description`}
      >
        {item.label}
      </div>
    </Item>
  );
}

function SectionTitle({
  className,
  onReset,
  showReset = false,
  title,
}: {
  className?: string;
  onReset?: () => void;
  showReset?: boolean;
  title: string;
}) {
  return (
    <div
      className={cn(
        "mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground",
        className,
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          className="size-4 rounded-full"
          onClick={onReset}
          size="icon"
          variant="secondary"
        >
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}

function SidebarConfig() {
  const { defaultVariant, setVariant, variant } = useLayout();

  return (
    <div className="max-md:hidden">
      <SectionTitle
        onReset={() => setVariant(defaultVariant)}
        showReset={defaultVariant !== variant}
        title="Sidebar"
      />
      <Radio
        aria-describedby="sidebar-description"
        aria-label="Select sidebar style"
        className="grid w-full max-w-md grid-cols-3 gap-4"
        onValueChange={setVariant}
        value={variant}
      >
        {[
          {
            icon: IconSidebarInset,
            label: "Inset",
            value: "inset",
          },
          {
            icon: IconSidebarFloating,
            label: "Floating",
            value: "floating",
          },
          {
            icon: IconSidebarSidebar,
            label: "Sidebar",
            value: "sidebar",
          },
        ].map((item) => (
          <RadioGroupItem item={item} key={item.value} />
        ))}
      </Radio>
      <div className="sr-only" id="sidebar-description">
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  );
}

function ThemeConfig() {
  const { defaultTheme, setTheme, theme } = useTheme();

  return (
    <div>
      <SectionTitle
        onReset={() => setTheme(defaultTheme)}
        showReset={theme !== defaultTheme}
        title="Theme"
      />
      <Radio
        aria-describedby="theme-description"
        aria-label="Select theme preference"
        className="grid w-full max-w-md grid-cols-3 gap-4"
        onValueChange={setTheme}
        value={theme}
      >
        {[
          {
            icon: IconThemeSystem,
            label: "System",
            value: "system",
          },
          {
            icon: IconThemeLight,
            label: "Light",
            value: "light",
          },
          {
            icon: IconThemeDark,
            label: "Dark",
            value: "dark",
          },
        ].map((item) => (
          <RadioGroupItem isTheme item={item} key={item.value} />
        ))}
      </Radio>
      <div className="sr-only" id="theme-description">
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  );
}
