"use client"

import { useAtomSet } from "@effect-atom/atom-react"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Service } from "@template/domain/service/application/ServiceApplicationDomain"
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient"
import * as Schema from "effect/Schema"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { v7 } from "uuid"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { HttpClient } from "@/lib/http-client"

export function ServicesDialogCreateUpdate({
  currentRow,
  onOpenChange,
  open,
}: {
  currentRow?: Service
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const t = useTranslations(
    "user.dashboard.components.services-dialog-create-update",
  )
  const formSchema = Schema.Struct({
    name: Schema.NonEmptyString.annotations({
      message: () => t("form.name.nonEmptyString"),
    }),
  })
  type UserForm = Schema.Schema.Type<typeof formSchema>
  const createMutationAtom = HttpClient.mutation("service", "create")
  const updateMutationAtom = HttpClient.mutation("service", "update")
  const createService = useAtomSet(createMutationAtom, {
    mode: "promise",
  })
  const updateService = useAtomSet(updateMutationAtom, {
    mode: "promise",
  })
  const form = useForm<UserForm>({
    defaultValues: currentRow
      ? {
          ...currentRow,
        }
      : {
          name: "",
        },
    resolver: effectTsResolver(formSchema),
  })

  const onSubmit = async (values: UserForm) => {
    form.reset()
    if (currentRow) {
      await updateService({
        headers: {
          "idempotency-key": IdempotencyKeyClient.make(v7()),
        },
        path: { id: currentRow.id },
        payload: { ...values },
        reactivityKeys: ["services"],
      })
    } else {
      await createService({
        headers: {
          "idempotency-key": IdempotencyKeyClient.make(v7()),
        },
        payload: { ...values },
        reactivityKeys: ["services"],
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
      open={open}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>
            {currentRow ? t("edit-title") : t("create-title")}
          </DialogTitle>
          <DialogDescription>
            {currentRow ? t("edit-description") : t("create-description")}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[4.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              className="space-y-4 px-0.5"
              id="service-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      {t("form.name.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="col-span-4"
                        placeholder="Example"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button form="service-form" type="submit">
            {currentRow ? t("form.edit-submit") : t("form.create-submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
