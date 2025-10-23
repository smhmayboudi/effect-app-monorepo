import type { Table } from "@tanstack/react-table";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDirection } from "@/context/direction-provider";
import { cn } from "@/lib/utils";

type DataTableBulkActionsProps<TData> = {
  children: React.ReactNode;
  entityName: string;
  table: Table<TData>;
};

/**
 * A modular toolbar for displaying bulk actions when table rows are selected.
 *
 * @template TData The type of data in the table.
 * @param {object} props The component props.
 * @param {Table<TData>} props.table The react-table instance.
 * @param {string} props.direction Left to Right or Right to left.
 * @param {string} props.entityName The name of the entity being acted upon (e.g., "task", "user").
 * @param {React.ReactNode} props.children The action buttons to be rendered inside the toolbar.
 * @returns {React.ReactNode | null} The rendered component or null if no rows are selected.
 */
export function DataTableBulkActions<TData>({
  children,
  entityName,
  table,
}: DataTableBulkActionsProps<TData>): null | React.ReactNode {
  const t = useTranslations("components.data-table-2.bulk-actions");
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (selectedCount > 0) {
      setAnnouncement(t("message", { entityName, selectedCount }));
      const timer = setTimeout(() => setAnnouncement(""), 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedCount, entityName]);

  const handleClearSelection = () => {
    table.resetRowSelection();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const buttons = toolbarRef.current?.querySelectorAll("button");
    if (!buttons) {
      return;
    }

    const currentIndex = Array.from(buttons).findIndex(
      (button) => button === document.activeElement,
    );

    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex =
          currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
        buttons[prevIndex]?.focus();
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % buttons.length;
        buttons[nextIndex]?.focus();
        break;
      }
      case "End":
        event.preventDefault();
        buttons[buttons.length - 1]?.focus();
        break;
      case "Escape": {
        // Check if the Escape key came from a dropdown trigger or content
        // We can't check dropdown state because Radix UI closes it before our handler runs
        const target = event.target as HTMLElement;
        const activeElement = document.activeElement as HTMLElement;

        // Check if the event target or currently focused element is a dropdown trigger
        const isFromDropdownTrigger =
          target?.getAttribute("data-slot") === "dropdown-menu-trigger" ||
          activeElement?.getAttribute("data-slot") ===
            "dropdown-menu-trigger" ||
          target?.closest('[data-slot="dropdown-menu-trigger"]') ||
          activeElement?.closest('[data-slot="dropdown-menu-trigger"]');

        // Check if the focused element is inside dropdown content (which is portaled)
        const isFromDropdownContent =
          activeElement?.closest('[data-slot="dropdown-menu-content"]') ||
          target?.closest('[data-slot="dropdown-menu-content"]');

        if (isFromDropdownTrigger || isFromDropdownContent) {
          // Escape was meant for the dropdown - don't clear selection
          return;
        }

        // Escape was meant for the toolbar - clear selection
        event.preventDefault();
        handleClearSelection();
        break;
      }
      case "Home":
        event.preventDefault();
        buttons[0]?.focus();
        break;
    }
  };

  const { dir } = useDirection();
  const selected = t("selected")

  return selectedCount === 0 ? (
    <></>
  ) : (
    <>
      {/* Live region for screen reader announcements */}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <div
        aria-describedby="bulk-actions-description"
        aria-label={t("toolbar-content", { entityName, selectedCount })}
        className={cn(
          "fixed start-1/2 bottom-6 z-50 rounded-xl transition-all delay-100 duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          dir === "rtl" ? "translate-x-1/2" : "-translate-x-1/2",
        )}
        onKeyDown={handleKeyDown}
        ref={toolbarRef}
        role="toolbar"
        tabIndex={-1}
      >
        <div className="flex items-center gap-x-2 rounded-xl border bg-background/95 p-2 shadow-xl backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t("tooltip-content")}
                className="size-6 rounded-full"
                onClick={handleClearSelection}
                size="icon"
                variant="outline"
              >
                <X />
                <span className="sr-only">Clear selection</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip-content")}</p>
            </TooltipContent>
          </Tooltip>

          <Separator
            aria-hidden="true"
            className="h-5"
            orientation="vertical"
          />

          <div
            className="flex items-center gap-x-1 text-sm"
            id="bulk-actions-description"
          >
            {t.rich("description", {
              badge: (chunks) => (
                <Badge
                  aria-label={`${selectedCount} ${selected}`}
                  className="min-w-8 rounded-lg"
                  variant="default">
                  {chunks}
                </Badge>
              ),
              entityName,
              selectedCount,
              span: (chunks) => <span className="hidden sm:inline">{chunks}</span>,
            })}
          </div>

          <Separator
            aria-hidden="true"
            className="h-5"
            orientation="vertical"
          />

          {children}
        </div>
      </div>
    </>
  );
}
