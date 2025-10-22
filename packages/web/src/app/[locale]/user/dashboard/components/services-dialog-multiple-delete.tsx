"use client";

import type { Table } from "@tanstack/react-table";

import { useAtomSet } from "@effect-atom/atom-react";
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpClient } from "@/lib/http-client";

export function ServicesDialogMultipleDelete<TData>({
  onOpenChange,
  open,
  table,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  table: Table<TData>;
}) {
  const t = useTranslations(
    "user.dashboard.components.services-dialog-multiple-delete",
  );
  const CONFIRM_WORD = "DELETE";
  const deleteMutationAtom = HttpClient.mutation("service", "delete");
  const deleteService = useAtomSet(deleteMutationAtom, {
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
      cancelBtnText={t("confirm-cancel")}
      confirmText={t("confirm-text")}
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t.rich("confirm-description", {
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>
          <Label className="my-4 flex flex-col items-start gap-1.5">
            {t.markup("confirm-name-title", { name: CONFIRM_WORD })}
            <Input
              onChange={(e) => setValue(e.target.value)}
              placeholder={t.markup("confirm-name-placeholder", {
                name: CONFIRM_WORD,
              })}
              value={value}
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>{t("alert-title")}</AlertTitle>
            <AlertDescription>{t("alert-description")}</AlertDescription>
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
          />
          {t("confirm-title", { length: selectedRows.length })}
        </span>
      }
    />
  );
}
