"use client";

import { useTranslations } from "next-intl";
import { Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import Link from "@/components/ui/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Client() {
  const t = useTranslations("user.change-password");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.annotations({
      message: () => t("form.email.nonEmptyString"),
    }).pipe(
      Schema.minLength(5, { message: () => t("form.email.minLength") }),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim, {
        message: () => t("form.email.pattern"),
      }),
    ),
    currentPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.currentPassword.nonEmptyString"),
    }),
    newPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.newPassword.nonEmptyString"),
    }),
  });
  const form = useForm<typeof schema.Type>({
    defaultValues: { email: "", currentPassword: "", newPassword: "" },
    resolver: effectTsResolver(schema),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  const { data } = authClient.useSession();
  useEffect(() => {
    if (data) {
      reset({ email: data.user.email });
    }
  }, [data]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
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
                <form
                  onSubmit={handleSubmit(
                    async ({ currentPassword, newPassword }) => {
                      const result = await authClient.changePassword({
                        currentPassword,
                        newPassword,
                        revokeOtherSessions: true,
                      });
                      if (result.error) {
                        toast.error(
                          result.error.message || "Failed to change password.",
                        );
                      }
                      if (result.data) {
                        toast.success("User change password successfully!");
                      }
                    },
                  )}
                >
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
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
                          <div className="flex justify-between items-center">
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
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
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
