"use client";

import type { Table } from "@tanstack/react-table";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table-2";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ServicesDialogMultipleDelete } from "./services-dialog-multiple-delete";

export function ServicesDataTableBulkActions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const t = useTranslations(
    "user.dashboard.components.services-data-table-bulk-actions",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar entityName={t("service")} table={table}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={t("delete-selected-services")}
              className="size-8"
              onClick={() => setShowDeleteConfirm(true)}
              size="icon"
              variant="destructive"
            >
              <Trash2 />
              <span className="sr-only">{t("delete-selected-services")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("delete-selected-services")}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <ServicesDialogMultipleDelete
        onOpenChange={setShowDeleteConfirm}
        open={showDeleteConfirm}
        table={table}
      />
    </>
  );
}
