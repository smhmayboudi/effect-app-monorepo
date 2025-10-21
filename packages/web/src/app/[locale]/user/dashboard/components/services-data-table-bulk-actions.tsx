"use client";

import type { Table } from "@tanstack/react-table";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table-2";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ServicesDialogMultipleDelete } from "./services-dialog-multiiple-delete";

type ServicesDataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function ServicesDataTableBulkActions<TData>({
  table,
}: ServicesDataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar entityName="service" table={table}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Delete selected services"
              className="size-8"
              onClick={() => setShowDeleteConfirm(true)}
              size="icon"
              title="Delete selected services"
              variant="destructive"
            >
              <Trash2 />
              <span className="sr-only">Delete selected services</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected services</p>
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
