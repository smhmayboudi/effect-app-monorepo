import { Loader } from "lucide-react"

import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectDropdownProps = {
  className?: string
  defaultValue: string | undefined

  disabled?: boolean
  isControlled?: boolean
  isPending?: boolean
  items: undefined | { label: string; value: string }[]
  onValueChange?: (value: string) => void
  placeholder?: string
}

export function SelectDropdown({
  className = "",
  defaultValue,
  disabled,
  isControlled = false,
  isPending,
  items,
  onValueChange,
  placeholder,
}: SelectDropdownProps) {
  const defaultState = isControlled
    ? { onValueChange, value: defaultValue }
    : { defaultValue, onValueChange }

  return (
    <Select {...defaultState}>
      <FormControl>
        <SelectTrigger className={className} disabled={disabled}>
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {isPending ? (
          <SelectItem className="h-14" disabled value="loading">
            <div className="flex items-center justify-center gap-2">
              <Loader className="size-5 animate-spin" />
              {"  "}
              Loading...
            </div>
          </SelectItem>
        ) : (
          items?.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
