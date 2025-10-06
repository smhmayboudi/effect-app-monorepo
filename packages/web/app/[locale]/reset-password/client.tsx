"use client";

import { useTranslations } from "next-intl";
import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Stack,
} from "@chakra-ui/react";
import { Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "@/component/ui/password-input";
import { Toaster, toaster } from "@/component/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ClientProps {
  error?: string;
  token?: string;
}

export default function Client({ error, token }: ClientProps) {
  const t = useTranslations("reset-password");
  const schema = Schema.Struct({
    newPassword: Schema.NonEmptyString,
    token: Schema.NonEmptyString,
  });
  const {
    formState: { errors, isLoading, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<typeof schema.Type>({ resolver: effectTsResolver(schema) });
  const router = useRouter();

  useEffect(() => {
    if (token) {
      reset({ token });
    }
  }, [token]);

  return error ? (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <Stack>
        <p>{t("title")}</p>
        <p>The password reset link is invalid or has expired.</p>
      </Stack>
    </AbsoluteCenter>
  ) : (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ newPassword }) => {
          const result = await authClient.resetPassword({ newPassword, token });
          if (result.error) {
            toaster.create({
              description: result.error.message || "Failed to reset password.",
              type: "error",
            });
          }
          if (result.data) {
            router.push("/sign-in");
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
            <Field.Root invalid={!!errors.newPassword} required>
              <Field.Label htmlFor="newPassword">
                New Password
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
