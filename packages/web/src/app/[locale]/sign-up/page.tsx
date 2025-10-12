import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import Client from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sign-up");

  return {
    description: t("description"),
    title: t("title"),
  };
}

export default async function Page() {
  return <Client />;
}
