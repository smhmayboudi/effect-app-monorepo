import React, { useState } from "react";

import useDialogState from "@/hooks/use-dialog-state";

import type { User } from "../data/schema";

type UsersContextType = {
  currentRow: null | User;
  open: null | UsersDialogType;
  setCurrentRow: React.Dispatch<React.SetStateAction<null | User>>;
  setOpen: (str: null | UsersDialogType) => void;
};

type UsersDialogType = "add" | "delete" | "edit" | "invite";

const UsersContext = React.createContext<null | UsersContextType>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<null | User>(null);

  return (
    <UsersContext value={{ currentRow, open, setCurrentRow, setOpen }}>
      {children}
    </UsersContext>
  );
}

export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>");
  }

  return usersContext;
};
