"use client"

import { Service } from "@template/domain/service/application/ServiceApplicationDomain"
import { createContext, useContext, useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"

type UsersContextType = {
  currentRow: null | Service
  open: null | UsersDialogType
  setCurrentRow: React.Dispatch<React.SetStateAction<null | Service>>
  setOpen: (str: null | UsersDialogType) => void
}

type UsersDialogType = "create" | "delete" | "update"

const UsersContext = createContext<null | UsersContextType>(null)

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<null | Service>(null)

  return (
    <UsersContext value={{ currentRow, open, setCurrentRow, setOpen }}>
      {children}
    </UsersContext>
  )
}

export const useUsers = () => {
  const usersContext = useContext(UsersContext)

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>")
  }

  return usersContext
}
