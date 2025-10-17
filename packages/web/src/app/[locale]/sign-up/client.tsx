"use client";

import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Effect, Schema } from "effect";
import { GalleryVerticalEnd } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/link";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { withToast } from "@/components/with-toast";
import { authClient } from "@/lib/auth-client";

export default function Client() {
  const t = useTranslations("sign-up");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.annotations({
      message: () => t("form.email.nonEmptyString"),
    }).pipe(
      Schema.minLength(5, { message: () => t("form.email.minLength") }),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim, {
        message: () => t("form.email.pattern"),
      }),
    ),
    name: Schema.NonEmptyString.annotations({
      message: () => t("form.name.nonEmptyString"),
    }),
    password: Schema.NonEmptyString.annotations({
      message: () => t("form.password.nonEmptyString"),
    }),
  });
  const form = useForm<typeof schema.Type>({
    defaultValues: { email: "", name: "", password: "" },
    resolver: effectTsResolver(schema),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;
  const router = useRouter();
  const locale = useLocale();
  const onSubmit = handleSubmit(async ({ email, name, password }) => {
    const result = await Effect.runPromise(
      Effect.tryPromise({
        catch: (error) => new Error(String(error)),
        try: (signal) =>
          authClient.signUp.email(
            {
              callbackURL: `http://127.0.0.1:3002/${locale}/user/dashboard`,
              email,
              name,
              password,
            },
            { signal },
          ),
      }).pipe(
        withToast({
          onFailure: (e) => `Failed to sign up with email. ${e.message}`,
          onSuccess: () => `Sign up with email successfully!`,
          onWaiting: "onWaiting",
        }),
      ),
    );
    if (result.data) {
      router.push(`/email-verification?email=${email}`);
    }
  });

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
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t("title2")}</CardTitle>
              <CardDescription>{t("content")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.name.title")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.email.title")}</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="email"
                              required
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>{t("form.password.title")}</FormLabel>
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
                      <FieldDescription className="flex justify-center gap-1 text-center">
                        {t.rich("form.description", {
                          url: (chunks) => (
                            <Link
                              className="underline-offset-4 hover:underline"
                              href="/sign-in"
                            >
                              {chunks}
                            </Link>
                          ),
                        })}
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </form>
              </Form>
            </CardContent>
          </Card>
          <FieldDescription className="flex flex-wrap justify-center gap-1 px-6 text-center">
            {t.rich("description2", {
              urlPP: (chunks) => (
                <Link className="underline-offset-4 hover:underline" href="#">
                  {chunks}
                </Link>
              ),
              urlTOS: (chunks) => (
                <Link className="underline-offset-4 hover:underline" href="#">
                  {chunks}
                </Link>
              ),
            })}
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
