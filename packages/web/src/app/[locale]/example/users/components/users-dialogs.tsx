"use client";

import { UsersActionDialog } from "./users-action-dialog";
import { UsersDeleteDialog } from "./users-delete-dialog";
import { UsersInviteDialog } from "./users-invite-dialog";
import { useUsers } from "./users-provider";

export function UsersDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useUsers();

  return (
    <>
      <UsersActionDialog
        // key="user-add"
        onOpenChange={() => setOpen("add")}
        open={open === "add"}
      />

      <UsersInviteDialog
        // key="user-invite"
        onOpenChange={() => setOpen("invite")}
        open={open === "invite"}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            currentRow={currentRow}
            // key={`user-edit-${currentRow.id}`}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            open={open === "edit"}
          />

          <UsersDeleteDialog
            currentRow={currentRow}
            // key={`user-delete-${currentRow.id}`}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            open={open === "delete"}
          />
        </>
      )}
    </>
  );
}
