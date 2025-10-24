"use client"

import { ServicesDialogCreateUpdate } from "./services-dialog-create-update"
import { ServicesDialogDelete } from "./services-dialog-delete"
import { useUsers } from "./services-provider"

export function ServicesDialogs() {
  const { currentRow, open, setCurrentRow, setOpen } = useUsers()

  return (
    <>
      <ServicesDialogCreateUpdate
        onOpenChange={() => setOpen("create")}
        open={open === "create"}
      />
      {currentRow && (
        <>
          <ServicesDialogCreateUpdate
            currentRow={currentRow}
            onOpenChange={() => {
              setOpen("update")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            open={open === "update"}
          />
          <ServicesDialogDelete
            currentRow={currentRow}
            onOpenChange={() => {
              setOpen("delete")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            open={open === "delete"}
          />
        </>
      )}
    </>
  )
}
