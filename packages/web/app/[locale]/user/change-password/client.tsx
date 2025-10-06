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
import { PasswordInput } from "@/component/ui/password-input";
import { Toaster, toaster } from "@/component/ui/toaster";
import { useEffect } from "react";

export default function Client() {
  const t = useTranslations("user.change-password");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.pipe(
      Schema.minLength(5),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)
    ),
    currentPassword: Schema.NonEmptyString,
    newPassword: Schema.NonEmptyString,
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
      reset({ email: data.user.email });
    }
  }, [data]);

  return (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ currentPassword, newPassword }) => {
          const result = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          });
          if (result.error) {
            toaster.create({
              description: result.error.message || "Failed to change password.",
              type: "error",
            });
          }
          if (result.data) {
            toaster.create({
              description: "User change password successfully!",
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
            <Input
              autoComplete="username"
              hidden={true}
              id="email"
              {...register("email")}
            />
            <Field.Root invalid={!!errors.currentPassword} required>
              <Field.Label htmlFor="currentPassword">
                Current Password
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                autoComplete="current-password"
                id="currentPassword"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <Field.ErrorText>
                  {errors.currentPassword.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.newPassword} required>
              <Field.Label htmlFor="newPassword">
                new Password
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                autoComplete="new-password"
                id="newPassword"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <Field.ErrorText>{errors.newPassword.message}</Field.ErrorText>
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
