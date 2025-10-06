"use client";

import { AbsoluteCenter, Stack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

interface ClientProps {
  email: string;
}

export default function Client({ email }: ClientProps) {
  const t = useTranslations("email-forgot-password");

  return (
    <AbsoluteCenter>
      <Stack>
        <p>{t("title")}</p>
        <p>
          If {email} email exists in our system, check your email for the reset
          link.
        </p>
      </Stack>
    </AbsoluteCenter>
  );
}
