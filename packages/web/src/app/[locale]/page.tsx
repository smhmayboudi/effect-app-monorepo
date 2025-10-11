import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import Nav from "@/components/nav";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("index");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page() {
  const t = await getTranslations("index");

  return (
    <div>
      <h2>{t("title")}</h2>
      <ModeToggle />
      <LocaleSwitcher />
      <Nav />
    </div>
  );
}
