"use client";

import { useAtom } from "@effect-atom/atom-react";
import { Service } from "@template/domain/service/application/ServiceApplicationDomain";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpClient } from "@/lib/http-client";

// import type { Service } from "../data/schema";

type ServicesDialogDeleteProps = {
  currentRow: Service;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function ServicesDialogDelete({
  currentRow,
  onOpenChange,
  open,
}: ServicesDialogDeleteProps) {
  const deleteMutationAtom = HttpClient.mutation("service", "delete");
  const [, deleteService] = useAtom(deleteMutationAtom, {
    mode: "promise",
  });
  const [value, setValue] = useState("");

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) {
      return;
    }

    setValue("");
    await deleteService({
      path: { id: currentRow.id },
      reactivityKeys: ["services"],
    });
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      confirmText="Delete"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the service from the system.
            This cannot be undone.
          </p>
          <Label className="my-2">
            Name:
            <Input
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter name to confirm deletion."
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
      disabled={value.trim() !== currentRow.name}
      handleConfirm={handleDelete}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete service
        </span>
      }
    />
  );
}
