"use client";

import { useTranslations } from "next-intl";
import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Effect, Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { Toaster, toaster } from "@/component/ui/toaster";
import { Registry } from "@effect-atom/atom-react";
import { HttpClient } from "@/lib/http-client";
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient";
import { v7 } from "uuid";

export default function Client() {
  const t = useTranslations("user.service-create");
  const schema = Schema.Struct({
    name: Schema.NonEmptyString,
  });
  const {
    formState: { errors, isLoading, isValid },
    handleSubmit,
    register,
  } = useForm<typeof schema.Type>({ resolver: effectTsResolver(schema) });

  return (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ name }) => {
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
              })
            );
            if (result.data) {
              toaster.create({
                description: `Service ${result.data} create successfully!`,
                type: "success",
              });
            }
          } catch (error) {
            toaster.create({
              description: `Failed to service create. ${
                (error as any).message || ""
              }`,
              type: "error",
            });
          }
        })}
      >
        <Fieldset.Root disabled={isLoading} invalid={!isValid} width="md">
          <Stack>
            <Fieldset.Legend
              fontSize="x-large"
              marginBottom="2"
              textAlign="center"
            >
              {t("title")}
            </Fieldset.Legend>
            <Fieldset.HelperText textAlign="center">
              Please provide your information below.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content marginBottom="2">
            <Field.Root invalid={!!errors.name} required>
              <Field.Label htmlFor="name">
                Name
                <Field.RequiredIndicator />
              </Field.Label>
              <Input autoComplete="name" id="name" {...register("name")} />
              {errors.name && (
                <Field.ErrorText>{errors.name.message}</Field.ErrorText>
              )}
            </Field.Root>
          </Fieldset.Content>
          <Button type="submit">Submit</Button>
          {errors.root && (
            <Fieldset.ErrorText>{errors.root.message}</Fieldset.ErrorText>
          )}
        </Fieldset.Root>
      </form>
      <Toaster />
    </AbsoluteCenter>
  );
}
