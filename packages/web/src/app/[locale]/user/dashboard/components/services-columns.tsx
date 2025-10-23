"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Service } from "@template/domain/service/application/ServiceApplicationDomain";

import { useTranslations } from "next-intl";

import { DataTableColumnHeader } from "@/components/data-table-2";
import { LongText } from "@/components/long-text";
import { Checkbox } from "@/components/ui/checkbox";

import { ServicesDataTableRowActions } from "./services-data-table-row-actions";

export const servicesColumns: ColumnDef<Service>[] = [
  {
    cell: ({ row }) => {
      const t = useTranslations("user.dashboard.components.services-columns");

      return (
        <Checkbox
          aria-label={t("select-row")}
          checked={row.getIsSelected()}
          className="translate-y-[2px]"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
    header: ({ table }) => {
      const t = useTranslations("user.dashboard.components.services-columns");

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
      );
    },
    id: "select",
    meta: {
      className: "w-8 sticky start-0 z-10 rounded-tl-[inherit] md:table-cell",
    },
  },
  {
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.id}</LongText>
    ),
    header: ({ column }) => {
      const t = useTranslations("user.dashboard.components.services-columns");

      return (
        <DataTableColumnHeader column={column} title={t("identification")} />
      );
    },
    id: "id",
    meta: { className: "w-36" },
  },
  {
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.ownerId}</LongText>
    ),
    header: ({ column }) => {
      const t = useTranslations("user.dashboard.components.services-columns");

      return (
        <DataTableColumnHeader
          column={column}
          title={t("owner-identification")}
        />
      );
    },
    id: "ownerId",
    meta: { className: "w-36" },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <LongText className="max-w-72">{row.original.name}</LongText>
    ),
    header: ({ column }) => {
      const t = useTranslations("user.dashboard.components.services-columns");

      return <DataTableColumnHeader column={column} title={t("name")} />;
    },
    id: "name",
    meta: { className: "w-36" },
  },
  {
    cell: ({ row }) => <ServicesDataTableRowActions row={row} />,
    id: "actions",
  },
];
