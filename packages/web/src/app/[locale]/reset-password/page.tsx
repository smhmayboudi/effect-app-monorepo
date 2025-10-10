import Client from "./client";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reset-password");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page() {
  return <Client />;
}
