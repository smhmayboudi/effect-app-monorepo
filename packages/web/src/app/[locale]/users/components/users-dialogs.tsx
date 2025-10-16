import { UsersActionDialog } from "./users-action-dialog";
import { UsersDeleteDialog } from "./users-delete-dialog";
import { UsersInviteDialog } from "./users-invite-dialog";
import { useUsers } from "./users-provider";

export function UsersDialogs({ direction }: { direction: "ltr" | "rtl" }) {
  const { currentRow, open, setCurrentRow, setOpen } = useUsers();

  return (
    <>
      <UsersActionDialog
        direction={direction}
        key="user-add"
        onOpenChange={() => setOpen("add")}
        open={open === "add"}
      />

      <UsersInviteDialog
        direction={direction}
        key="user-invite"
        onOpenChange={() => setOpen("invite")}
        open={open === "invite"}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            currentRow={currentRow}
            direction={direction}
            key={`user-edit-${currentRow.id}`}
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
            direction={direction}
            key={`user-delete-${currentRow.id}`}
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
