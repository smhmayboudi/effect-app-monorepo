"use client";

import { useTranslations } from "next-intl";

interface ClientProps {
  email: string;
}

export default function Client({ email }: ClientProps) {
  const t = useTranslations("email-verification");

  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{email}</p>
    </div>
  );
}
