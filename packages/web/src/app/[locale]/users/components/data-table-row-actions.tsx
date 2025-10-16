import type { Row } from "@tanstack/react-table";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Trash2, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { User } from "../data/schema";

import { useUsers } from "./users-provider";

type DataTableRowActionsProps = {
  direction: "ltr" | "rtl";
  row: Row<User>;
};

export function DataTableRowActions({
  direction,
  row,
}: DataTableRowActionsProps) {
  const { setCurrentRow, setOpen } = useUsers();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            variant="ghost"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original);
              setOpen("edit");
            }}
          >
            Edit
            <DropdownMenuShortcut direction={direction}>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500!"
            onClick={() => {
              setCurrentRow(row.original);
              setOpen("delete");
            }}
          >
            Delete
            <DropdownMenuShortcut direction={direction}>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
