"use client";

import { useTranslations } from "next-intl";
import { Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "@/components/ui/link";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";

export default function Client() {
  const t = useTranslations("reset-password");
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "";
  const token = searchParams.get("token") || "";

  const schema = Schema.Struct({
    newPassword: Schema.NonEmptyString.annotations({
      message: () => t("form.newPassword.nonEmptyString"),
    }),
    token: Schema.NonEmptyString.annotations({
      message: () => t("form.token.nonEmptyString"),
    }),
  });
  const form = useForm<typeof schema.Type>({
    defaultValues: { newPassword: "", token: "" },
    resolver: effectTsResolver(schema),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;
  const router = useRouter();

  useEffect(() => {
    if (token) {
      reset({ token });
    }
  }, [reset, token]);

  return error ? (
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
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">{t("error.title")}</CardTitle>
              <CardDescription>{t("error.content")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/auth/login">{t("error.backToSignIn")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ) : (
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
                  onSubmit={handleSubmit(async ({ newPassword, token }) => {
                    const result = await authClient.resetPassword({
                      newPassword,
                      token,
                    });
                    if (result.error) {
                      toast.error(
                        result.error.message || "Failed to reset password.",
                      );
                    }
                    if (result.data) {
                      router.push("/sign-in");
                    }
                  })}
                >
                  <FieldGroup>
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
