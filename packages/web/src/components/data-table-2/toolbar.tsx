import type { Table } from "@tanstack/react-table";

import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

type DataTableToolbarProps<TData> = {
  direction: "ltr" | "rtl";
  filters?: {
    columnId: string;
    options: {
      icon?: React.ComponentType<{ className?: string }>;
      label: string;
      value: string;
    }[];
    title: string;
  }[];
  searchKey?: string;
  searchPlaceholder?: string;
  table: Table<TData>;
};

export function DataTableToolbar<TData>({
  direction = "ltr",
  filters = [],
  searchKey,
  searchPlaceholder = "Filter...",
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchKey ? (
          <Input
            className="h-8 w-[150px] lg:w-[250px]"
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
          />
        ) : (
          <Input
            className="h-8 w-[150px] lg:w-[250px]"
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ""}
          />
        )}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                column={column}
                direction={direction}
                key={filter.columnId}
                options={filter.options}
                title={filter.title}
              />
            );
          })}
        </div>
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            variant="ghost"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions direction={direction} table={table} />
    </div>
  );
}
