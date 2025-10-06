"use client";

import { useLocale, useTranslations } from "next-intl";
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
import { useRouter } from "next/navigation";

export default function Client() {
  const t = useTranslations("forgot-password");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.pipe(
      Schema.minLength(5),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)
    ),
  });
  const {
    formState: { errors, isLoading, isValid },
    handleSubmit,
    register,
  } = useForm<typeof schema.Type>({ resolver: effectTsResolver(schema) });
  const router = useRouter();
  const locale = useLocale();

  return (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ email }) => {
          const result = await authClient.forgetPassword({
            email,
            redirectTo: `http://127.0.0.1:3002/${locale}/reset-password`,
          });
          if (result.error) {
            toaster.create({
              description: result.error.message || "Failed to forgot password.",
              type: "error",
            });
          }
          if (result.data) {
            router.push(`/email-forgot-password?email=${email}`);
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
            <Field.Root invalid={!!errors.email} required>
              <Field.Label htmlFor="email">
                Email
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                autoComplete="username"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <Field.ErrorText>{errors.email.message}</Field.ErrorText>
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
