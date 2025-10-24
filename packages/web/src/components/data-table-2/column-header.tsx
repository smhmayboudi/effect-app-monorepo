import type { Column } from "@tanstack/react-table";

import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ArrowUpDown,
  EyeOff,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDirection } from "@/context/direction-provider";
import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
  };

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations("components.data-table-2.column-header");
  const { dir } = useDirection();
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="-ms-3 h-8 data-[state=open]:bg-accent"
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ms-2 size-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ms-2 size-4" />
            ) : dir === "rtl" ? (
              <ArrowUpDown className="ms-2 size-4" />
            ) : (
              <ArrowDownUp className="ms-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="size-3.5 text-muted-foreground/70" />
            {t("asc")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="size-3.5 text-muted-foreground/70" />
            {t("desc")}
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="size-3.5 text-muted-foreground/70" />
                {t("hide")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
