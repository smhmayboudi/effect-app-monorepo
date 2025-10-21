"use client";

import type { Table } from "@tanstack/react-table";

import { useAtom } from "@effect-atom/atom-react";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpClient } from "@/lib/http-client";
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain";

type ServicesDialogMultipleDeleteProps<TData> = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  table: Table<TData>;
};

const CONFIRM_WORD = "DELETE";

export function ServicesDialogMultipleDelete<TData>({
  onOpenChange,
  open,
  table,
}: ServicesDialogMultipleDeleteProps<TData>) {
  const deleteMutationAtom = HttpClient.mutation("service", "delete");
  const [, deleteService] = useAtom(deleteMutationAtom, {
    mode: "promise",
  });
  const [value, setValue] = useState("");

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      return;
    }

    setValue("");
    await Promise.all(
      selectedRows.map((value) =>
        deleteService({
          path: { id: ServiceId.make(value.id) },
          reactivityKeys: ["services"],
        }),
      ),
    );
    table.resetRowSelection();
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      confirmText="Delete"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">the selected services?</span>?
            <br />
            This action will permanently remove the service from the system.
            This cannot be undone.
          </p>
          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span className="">
              Confirm by typing &quot;{CONFIRM_WORD}&quot;:
            </span>
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
          {selectedRows.length > 1 ? "services" : "service"}
        </span>
      }
    />
  );
}
