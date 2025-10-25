"use client"

import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { GalleryVerticalEnd } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from "@/components/ui/link"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { PasswordInput } from "@/components/ui/password-input"
import { withToast } from "@/components/with-toast"
import { authClient } from "@/lib/auth-client"

export default function Client() {
  const t = useTranslations("reset-password")
  const formSchema = Schema.Struct({
    newPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.newPassword.nonEmptyString"),
    }),
    token: Schema.NonEmptyString.annotations({
      message: () => t("form.token.nonEmptyString"),
    }),
  })
  const form = useForm<typeof formSchema.Type>({
    defaultValues: { newPassword: "", token: "" },
    resolver: effectTsResolver(formSchema),
  })
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form
  const router = useRouter()
  const onSubmit = handleSubmit(async ({ newPassword, token }) => {
    const result = await Effect.runPromise(
      Effect.tryPromise({
        catch: (error) => new Error(String(error)),
        try: (signal) =>
          authClient.resetPassword({ newPassword, token }, { signal }),
      }).pipe(
        withToast({
          onFailure: (e) => `Failed to reset password. ${e.message}`,
          onSuccess: () => `Reset password successfully!`,
          onWaiting: "onWaiting",
        }),
      ),
    )
    if (result.data) {
      router.push("/sign-in")
    }
  })

  const searchParams = useSearchParams()
  const error = searchParams.get("error") || ""
  const token = searchParams.get("token") || ""
  useEffect(() => {
    if (token) {
      reset({ token })
    }
  }, [reset, token])

  return error ? (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="#"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <div className="flex flex-col gap-6">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">{t("error.title")}</CardTitle>
              <CardDescription>{t("error.content")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/auth/login">{t("error.backToSignIn")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="#"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t("title")}</CardTitle>
              <CardDescription>{t("content")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>{t("form.newPassword.title")}</FormLabel>
                          </div>
                          <FormControl>
                            <PasswordInput
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Field>
                      <Button
                        className="w-full"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        <LoadingSwap isLoading={isSubmitting}>
                          {t("form.submit")}
                        </LoadingSwap>
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
