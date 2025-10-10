import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import Nav from "@/components/nav";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("index");
  const locale = await getLocale();

  return (
    <div>
      <h2>{t("title")}</h2>
      <ModeToggle direction={locale === "fa" ? "rtl" : "ltr"} />
      <LocaleSwitcher />
      <Nav />
    </div>
  );
}
