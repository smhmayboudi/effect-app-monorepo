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
import { Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Toaster, toaster } from "@/component/ui/toaster";
import { useEffect } from "react";

export default function Client() {
  const t = useTranslations("user.update");
  const schema = Schema.Struct({
    name: Schema.NonEmptyString,
  });
  const { data } = authClient.useSession();
  const {
    formState: { errors, isLoading, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<typeof schema.Type>({ resolver: effectTsResolver(schema) });

  useEffect(() => {
    if (data) {
      reset({ name: data.user.name });
    }
  }, [data, reset]);

  return (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ name }) => {
          const result = await authClient.updateUser({ name });
          if (result.error) {
            toaster.create({
              description: result.error.message || "Failed to sign up.",
              type: "error",
            });
          }
          if (result.data) {
            toaster.create({
              description: "Sign up successfully!",
              type: "success",
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
