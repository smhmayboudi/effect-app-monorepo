"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Schema } from "effect";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Info,
} from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "@/components/ui/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const schema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  ownerId: Schema.String,
});

const columns = (direction: "ltr" | "rtl"): ColumnDef<typeof schema.Type>[] => [
  {
    accessorKey: "ownerId",
    cell: ({ row }) => row.original.ownerId,
    header: "Owner Identification",
  },
  {
    accessorKey: "id",
    cell: ({ row }) => row.original.id,
    header: "Identification",
  },
  {
    accessorKey: "name",
    cell: ({ row }) => row.original.name,
    header: "Name",
  },
  {
    accessorKey: "help",
    cell: ({ row }) => (
      <Link href={`/user/service-help/${row.original.id}`}>
        <Info />
      </Link>
    ),
    header: "Help",
  },
];

export function DataTable({
  data: initialData,
  direction,
}: {
  data: (typeof schema.Type)[];
  direction: "ltr" | "rtl";
}) {
  const [data, setData] = useState(() => initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    columns: columns(direction),
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      className="flex w-full flex-col justify-start gap-6"
      defaultValue="outline"
    >
      <TabsContent
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        value="outline"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            id={sortableId}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                      colSpan={columns(direction).length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label className="text-sm font-medium" htmlFor="rows-per-page">
                Rows per page
              </Label>
              <Select
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                value={`${table.getState().pagination.pageSize}`}
              >
                <SelectTrigger className="w-20" id="rows-per-page" size="sm">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                variant="outline"
              >
                <span className="sr-only">Go to first page</span>
                {direction === "rtl" ? (
                  <ChevronsRightIcon />
                ) : (
                  <ChevronsLeftIcon />
                )}
              </Button>
              <Button
                className="size-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Go to previous page</span>
                {direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </Button>
              <Button
                className="size-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Go to next page</span>
                {direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </Button>
              <Button
                className="hidden size-8 lg:flex"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                size="icon"
                variant="outline"
              >
                <span className="sr-only">Go to last page</span>
                {direction === "rtl" ? (
                  <ChevronsLeftIcon />
                ) : (
                  <ChevronsRightIcon />
                )}
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        className="flex flex-col px-4 lg:px-6"
        value="past-performance"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent className="flex flex-col px-4 lg:px-6" value="key-personnel">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        className="flex flex-col px-4 lg:px-6"
        value="focus-documents"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

function DraggableRow({ row }: { row: Row<typeof schema.Type> }) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      data-dragging={isDragging}
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
