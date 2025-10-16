import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import Nav from "@/components/nav";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("index");

  return {
    description: t("description"),
    title: t("title"),
  };
}

export default async function Page() {
  const t = await getTranslations("index");

  return (
    <div>
      <h2>{t("title")}</h2>
      <ModeToggle direction="ltr" />
      <LocaleSwitcher />
      <Nav />
    </div>
  );
}
