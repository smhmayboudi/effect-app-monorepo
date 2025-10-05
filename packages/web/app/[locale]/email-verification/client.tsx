"use client";

import { AbsoluteCenter } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

interface ClientProps {
  email: string;
}

export default function Client({ email }: ClientProps) {
  const t = useTranslations("email-verification");

  return (
    <AbsoluteCenter>
      <p>{t("title")}</p>
      <p>
        We sent you a verification link to {email}. Please check your email and
        click the link to verify your account.
      </p>
    </AbsoluteCenter>
  );
}
