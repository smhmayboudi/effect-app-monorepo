import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import {
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table-2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type NavigateFn, useTableUrlState } from "@/hooks/use-table-url-state";
import { cn } from "@/lib/utils";

import type { User } from "../data/schema";

import { roles } from "../data/data";
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { usersColumns as columns } from "./users-columns";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className: string;
  }
}

type DataTableProps = {
  data: User[];
  direction: "ltr" | "rtl";
  navigate: NavigateFn;
  search: Record<string, unknown>;
};

export function UsersTable({
  data,
  direction,
  navigate,
  search,
}: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
  const {
    columnFilters,
    ensurePageInRange,
    onColumnFiltersChange,
    onPaginationChange,
    pagination,
  } = useTableUrlState({
    columnFilters: [
      // username per-column text filter
      { columnId: "username", searchKey: "username", type: "string" },
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "role", searchKey: "role", type: "array" },
    ],
    globalFilter: { enabled: false },
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    search,
  });

  const table = useReactTable({
    columns: columns(direction),
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table, ensurePageInRange]);

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        direction={direction}
        filters={[
          {
            columnId: "status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Invited", value: "invited" },
              { label: "Suspended", value: "suspended" },
            ],
            title: "Status",
          },
          {
            columnId: "role",
            options: roles.map((role) => ({ ...role })),
            title: "Role",
          },
        ]}
        searchKey="username"
        searchPlaceholder="Filter users..."
        table={table}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="group/row" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                        header.column.columnDef.meta?.className ?? "",
                      )}
                      colSpan={header.colSpan}
                      direction={direction}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="group/row"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                        cell.column.columnDef.meta?.className ?? "",
                      )}
                      direction={direction}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns(direction).length}
                  direction={direction}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination direction={direction} table={table} />
      <DataTableBulkActions direction={direction} table={table} />
    </div>
  );
}
