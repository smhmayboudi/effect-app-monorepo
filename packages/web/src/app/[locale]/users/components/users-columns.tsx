import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-2";
import { LongText } from "@/components/long-text";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { User } from "../data/schema";

import { callTypes, roles } from "../data/data";
import { DataTableRowActions } from "./data-table-row-actions";

export const usersColumns = (direction: "ltr" | "rtl"): ColumnDef<User>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        className="translate-y-[2px]"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="translate-y-[2px]"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: "select",
    meta: {
      className: cn("sticky start-0 z-10 rounded-tl-[inherit] md:table-cell"),
    },
  },
  {
    accessorKey: "username",
    cell: ({ row }) => (
      <LongText className="max-w-36" direction={direction}>
        {row.getValue("username")}
      </LongText>
    ),
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Username"
      />
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none",
      ),
    },
  },
  {
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      const fullName = `${firstName} ${lastName}`;
      return (
        <LongText className="max-w-36" direction={direction}>
          {fullName}
        </LongText>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Name"
      />
    ),
    id: "fullName",
    meta: { className: "w-36" },
  },
  {
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Email"
      />
    ),
  },
  {
    accessorKey: "phoneNumber",
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Phone Number"
      />
    ),
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = callTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge className={cn("capitalize", badgeColor)} variant="outline">
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Status"
      />
    ),
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      const { role } = row.original;
      const userType = roles.find(({ value }) => value === role);

      if (!userType) {
        return null;
      }

      return (
        <div className="flex items-center gap-x-2">
          {userType.icon && (
            <userType.icon className="text-muted-foreground" size={16} />
          )}
          <span className="text-sm capitalize">{row.getValue("role")}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        direction={direction}
        title="Role"
      />
    ),
  },
  {
    cell: ({ row }) => <DataTableRowActions direction={direction} row={row} />,
    id: "actions",
  },
];
