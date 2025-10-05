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
import { useRouter } from "next/navigation";

export default function Client() {
  const t = useTranslations("sign-up");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.pipe(
      Schema.minLength(5),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)
    ),
    name: Schema.NonEmptyString,
    password: Schema.NonEmptyString,
  });
  const {
    formState: { errors, isLoading, isValid },
    handleSubmit,
    register,
  } = useForm<typeof schema.Type>({ resolver: effectTsResolver(schema) });
  const router = useRouter();

  return (
    <AbsoluteCenter borderWidth="thin" padding="2">
      <form
        onSubmit={handleSubmit(async ({ email, name, password }) => {
          const result = await authClient.signUp.email({
            email,
            name,
            password,
          });
          if (result.error) {
            toaster.create({
              description: result.error.message || "Failed to sign up.",
              type: "error",
            });
          }
          if (result.data) {
            router.push(`/email-verification?email=${email}`);
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
            <Field.Root invalid={!!errors.password} required>
              <Field.Label htmlFor="password">
                Password
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                autoComplete="current-password"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
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
