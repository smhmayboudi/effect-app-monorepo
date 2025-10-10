"use client";

import { useTranslations } from "next-intl";
import { Effect, Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";

import { Registry } from "@effect-atom/atom-react";
import { HttpClient } from "@/lib/http-client";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { v7 } from "uuid";

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
    try {
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
        }),
      );
      if (result.data) {
        toast.success(`Service ${result.data} create successfully!`);
      }
      router.push("/user/dashboard");
    } catch (error) {
      toast.error(
        `Failed to service create. ${
          (error as { message: string }).message || ""
        }`,
      );
    }
  });

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
