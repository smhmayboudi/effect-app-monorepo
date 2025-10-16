"use client";

import type { Table } from "@tanstack/react-table";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sleep } from "@/lib/utils";

type UserMultiDeleteDialogProps<TData> = {
  direction: "ltr" | "rtl";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  table: Table<TData>;
};

const CONFIRM_WORD = "DELETE";

export function UsersMultiDeleteDialog<TData>({
  direction,
  onOpenChange,
  open,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState("");

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`);
      return;
    }

    onOpenChange(false);

    toast.promise(sleep(2000), {
      error: "Error",
      loading: "Deleting users...",
      success: () => {
        table.resetRowSelection();
        return `Deleted ${selectedRows.length} ${
          selectedRows.length > 1 ? "users" : "user"
        }`;
      },
    });
  };

  return (
    <ConfirmDialog
      confirmText="Delete"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span className="">Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              value={value}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      destructive
      direction={direction}
      disabled={value.trim() !== CONFIRM_WORD}
      handleConfirm={handleDelete}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete {selectedRows.length}{" "}
          {selectedRows.length > 1 ? "users" : "user"}
        </span>
      }
    />
  );
}
