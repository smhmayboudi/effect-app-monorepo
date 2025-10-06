"use client";

import { useTranslations } from "next-intl";
import {
  AbsoluteCenter,
  Button,
  Field,
  Fieldset,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import { Schema } from "effect";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "@/component/ui/password-input";
import { Toaster, toaster } from "@/component/ui/toaster";
import { useRouter } from "next/navigation";
import CLink from "@/component/ui/link";

interface ClientProps {
  callbackURL: string;
}

export default function Client({ callbackURL }: ClientProps) {
  const t = useTranslations("sign-in");
  const schema = Schema.Struct({
    email: Schema.NonEmptyString.pipe(
      Schema.minLength(5),
      Schema.pattern(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)
    ),
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
      <Stack>
        <form
          onSubmit={handleSubmit(async ({ email, password }) => {
            const result = await authClient.signIn.email({ email, password });
            if (result.error) {
              toaster.create({
                description: result.error.message || "Failed to sign in.",
                type: "error",
              });
            }
            if (result.data) {
              router.push(callbackURL);
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
              <Field.Root>
                <Link asChild variant="underline">
                  <CLink href="/forgot-password">Forgot Password</CLink>
                </Link>
              </Field.Root>
            </Fieldset.Content>
            <Button type="submit">Submit</Button>
            {errors.root && (
              <Fieldset.ErrorText>{errors.root.message}</Fieldset.ErrorText>
            )}
          </Fieldset.Root>
        </form>
        <p>
          <Link asChild variant="underline">
            <CLink href="/sign-">Sign up</CLink>
          </Link>
          &nbsp;if you do not have an account.
        </p>
      </Stack>
      <Toaster />
    </AbsoluteCenter>
  );
}
