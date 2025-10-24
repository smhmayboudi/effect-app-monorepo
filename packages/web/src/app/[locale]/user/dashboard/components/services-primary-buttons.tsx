"use client"

import { UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

import { useUsers } from "./services-provider"

export function ServicesPrimaryButtons() {
  const t = useTranslations(
    "user.dashboard.components.services-primary-buttons",
  )
  const { setOpen } = useUsers()

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <span>{t("service-create")}</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
