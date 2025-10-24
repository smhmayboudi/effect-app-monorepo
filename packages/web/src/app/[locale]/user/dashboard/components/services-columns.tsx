"use client"

import type { Column, Row, Table } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Service } from "@template/domain/service/application/ServiceApplicationDomain"

import { useTranslations } from "next-intl"

import { DataTableColumnHeader } from "@/components/data-table-2"
import { LongText } from "@/components/long-text"
import { Checkbox } from "@/components/ui/checkbox"

import { ServicesDataTableRowActions } from "./services-data-table-row-actions"

function IdHeader<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const t = useTranslations("user.dashboard.components.services-columns")

  return <DataTableColumnHeader column={column} title={t("identification")} />
}

function NameHeader<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const t = useTranslations("user.dashboard.components.services-columns")

  return <DataTableColumnHeader column={column} title={t("name")} />
}

function OwnerIdHeader<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const t = useTranslations("user.dashboard.components.services-columns")

  return (
    <DataTableColumnHeader column={column} title={t("owner-identification")} />
  )
}

function SelectCell<TData, TValue>({ row }: { row: Row<Service> }) {
  const t = useTranslations("user.dashboard.components.services-columns")

  return (
    <Checkbox
      aria-label={t("select-row")}
      checked={row.getIsSelected()}
      className="translate-y-[2px]"
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  )
}

function SelectHeader({ table }: { table: Table<Service> }) {
  const t = useTranslations("user.dashboard.components.services-columns")

  return (
    <Checkbox
      aria-label={t("select-all")}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      className="translate-y-[2px]"
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  )
}

export const servicesColumns: ColumnDef<Service>[] = [
  {
    cell: ({ row }) => <SelectCell row={row} />,
    header: ({ table }) => <SelectHeader table={table} />,
    id: "select",
    meta: {
      className: "w-8 sticky start-0 z-10 rounded-tl-[inherit] md:table-cell",
    },
  },
  {
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.id}</LongText>
    ),
    header: ({ column }) => <IdHeader column={column} />,
    id: "id",
    meta: { className: "w-36" },
  },
  {
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.ownerId}</LongText>
    ),
    header: ({ column }) => <OwnerIdHeader column={column} />,
    id: "ownerId",
    meta: { className: "w-36" },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.name}</LongText>
    ),
    header: ({ column }) => <NameHeader column={column} />,
    id: "name",
    meta: { className: "w-36" },
  },
  {
    cell: ({ row }) => <ServicesDataTableRowActions row={row} />,
    id: "actions",
  },
]
