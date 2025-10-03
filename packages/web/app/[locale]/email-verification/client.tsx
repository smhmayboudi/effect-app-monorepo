"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Client() {
  const t = useTranslations("email-verification");

  return (
    <div>
      <h2>{t("title")}</h2>
    </div>
  );
}
