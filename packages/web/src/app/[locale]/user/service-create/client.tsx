"use client";

import { Registry } from "@effect-atom/atom-react";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { Effect, Schema } from "effect";
import { GalleryVerticalEnd } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v7 } from "uuid";

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
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/link";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { withToast } from "@/components/with-toast";
import { HttpClient } from "@/lib/http-client";
import { cn } from "@/lib/utils";

export default function Client() {
  const t = useTranslations("user.service-create");
  const schema = Schema.Struct({
    name: Schema.NonEmptyString.annotations({
      message: () => t("form.name.nonEmptyString"),
    }),
  });
  const form = useForm<typeof schema.Type>({
    defaultValues: { name: "" },
    resolver: effectTsResolver(schema),
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;
  const router = useRouter();
  const onSubmit = handleSubmit(async ({ name }) => {
    const createMutation = HttpClient.mutation("service", "create");
    const registry = Registry.make();
    registry.set(createMutation, {
      headers: {
        "idempotency-key": IdempotencyKeyClient.make(v7()),
      },
      payload: { name },
      reactivityKeys: ["services"],
    });
    const result = await Effect.runPromise(
      Registry.getResult(registry, createMutation, {
        suspendOnWaiting: true,
      }).pipe(
        withToast({
          onFailure: (e) => `Failed to service create. ${e.message}`,
          onSuccess: (a) => `Service ${a.data} create successfully!`,
          onWaiting: "onWaiting",
        }),
      ),
    );
    if (result.data) {
      router.push("/user/dashboard");
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.name.title")}</FormLabel>
                          <FormControl>
                            <Input required {...field} />
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
