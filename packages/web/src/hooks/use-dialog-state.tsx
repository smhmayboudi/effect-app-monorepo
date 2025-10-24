import { useState } from "react"

/**
 * Custom hook for confirm dialog
 * @param initialState string | null
 * @returns A stateful value, and a function to update it.
 * @example const [open, setOpen] = useDialogState<"approve" | "reject">()
 */
export default function useDialogState<T extends boolean | string>(
  initialState: null | T = null,
) {
  const [open, _setOpen] = useState<null | T>(initialState)

  const setOpen = (str: null | T) =>
    _setOpen((prev) => (prev === str ? null : str))

  return [open, setOpen] as const
}
