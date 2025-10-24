"use client"

import type { Row } from "@tanstack/react-table"

import { Ellipsis, Trash2, UserPen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { User } from "../data/schema"

import { useUsers } from "./users-provider"

type UsersDataTableRowActionsProps = {
  row: Row<User>
}

export function UsersDataTableRowActions({
  row,
}: UsersDataTableRowActionsProps) {
  const { setCurrentRow, setOpen } = useUsers()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex size-8 p-0 data-[state=open]:bg-muted"
            variant="ghost"
          >
            <Ellipsis className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen("edit")
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500!"
            onClick={() => {
              setCurrentRow(row.original)
              setOpen("delete")
            }}
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
