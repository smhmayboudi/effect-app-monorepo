"use client";

import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Effect, Schema } from "effect";
import { GalleryVerticalEnd } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "@/components/ui/link";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { withToast } from "@/components/with-toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function Client() {
  const t = useTranslations("user.change-password");
  const schema = Schema.Struct({
    currentPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.currentPassword.nonEmptyString"),
    }),
    email: Schema.NonEmptyString.annotations({
      message: () => t("form.email.nonEmptyString"),
    }).pipe(
      Schema.minLength(5, { message: () => t("form.email.minLength") }),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim, {
        message: () => t("form.email.pattern"),
      }),
    ),
    newPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.newPassword.nonEmptyString"),
    }),
  });
  const form = useForm<typeof schema.Type>({
    defaultValues: { currentPassword: "", email: "", newPassword: "" },
    resolver: effectTsResolver(schema),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;
  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    await Effect.runPromise(
      Effect.tryPromise({
        catch: (error) => new Error(String(error)),
        try: (signal) =>
          authClient.changePassword(
            {
              currentPassword,
              newPassword,
              revokeOtherSessions: true,
            },
            { signal },
          ),
      }).pipe(
        withToast({
          onFailure: (e) => `Failed to change password. ${e.message}`,
          onSuccess: () => `Change password successfully!`,
          onWaiting: "onWaiting",
        }),
      ),
    );
  });

  const { data } = authClient.useSession();
  useEffect(() => {
    if (data) {
      reset({ email: data.user.email });
    }
  }, [reset, data]);

  return (
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
        <div className={cn("flex flex-col gap-6")}>
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
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>
                              {t("form.currentPassword.title")}
                            </FormLabel>
                          </div>
                          <FormControl>
                            <PasswordInput
                              autoComplete="current-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
  );
}
