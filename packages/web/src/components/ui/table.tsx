"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      data-slot="table-caption"
      {...props}
    />
  );
}

function TableCell({
  className,
  direction,
  ...props
}: ComponentProps<"td"> & { direction: "ltr" | "rtl" }) {
  return (
    <td
      className={cn(
        "p-2 align-middle whitespace-nowrap [&>[role=checkbox]]:translate-y-[2px]",
        direction === "rtl"
          ? "[&:has([role=checkbox])]:pl-0"
          : "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

function TableHead({
  className,
  direction,
  ...props
}: ComponentProps<"th"> & { direction: "ltr" | "rtl" }) {
  return (
    <th
      className={cn(
        "h-10 px-2 align-middle font-medium whitespace-nowrap text-foreground [&>[role=checkbox]]:translate-y-[2px]",
        direction === "rtl"
          ? "text-right [&:has([role=checkbox])]:pl-0"
          : "text-left [&:has([role=checkbox])]:pr-0",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
