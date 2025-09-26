import type { Metadata } from "next";
import Client from "./client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("user.update");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return <Client />;
}
