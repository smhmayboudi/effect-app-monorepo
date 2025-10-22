"use client";

import { useAtomSet } from "@effect-atom/atom-react";
import { Service } from "@template/domain/service/application/ServiceApplicationDomain";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpClient } from "@/lib/http-client";

export function ServicesDialogDelete({
  currentRow,
  onOpenChange,
  open,
}: {
  currentRow: Service;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const t = useTranslations("user.dashboard.components.services-dialog-delete");
  const deleteMutationAtom = HttpClient.mutation("service", "delete");
  const deleteService = useAtomSet(deleteMutationAtom, {
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
      cancelBtnText={t("confirm-cancel")}
      confirmText={t("confirm-text")}
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t.rich("confirm-description", {
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
              name: currentRow.name,
            })}
          </p>
          <Label className="my-4 flex flex-col items-start gap-1.5">
            {t.rich("confirm-name-title", {
              name: t("confirm-name"),
              quot: (chunks) => `"${chunks}"`,
            })}
            <Input
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("confirm-name-placeholder")}
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
      disabled={value.trim() !== currentRow.name}
      handleConfirm={handleDelete}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />
          {t("confirm-title")}
        </span>
      }
    />
  );
}
