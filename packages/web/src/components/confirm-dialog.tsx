import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  cancelBtnText?: string
  children?: React.ReactNode
  className?: string
  confirmText?: React.ReactNode
  desc: React.JSX.Element | string
  destructive?: boolean
  disabled?: boolean
  handleConfirm: () => void
  isLoading?: boolean
  onOpenChange: (open: boolean) => void
  open: boolean
  title: React.ReactNode
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    cancelBtnText,
    children,
    className,
    confirmText,
    desc,
    destructive,
    disabled = false,
    handleConfirm,
    isLoading,
    title,
    ...actions
  } = props

  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText ?? "Cancel"}
          </AlertDialogCancel>
          <Button
            disabled={disabled || isLoading}
            onClick={handleConfirm}
            variant={destructive ? "destructive" : "default"}
          >
            {confirmText ?? "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
