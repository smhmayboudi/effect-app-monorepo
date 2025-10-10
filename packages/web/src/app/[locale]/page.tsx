import Nav from "@/components/nav";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("index");

  return (
    <div>
      <h2>{t("title")}</h2>
      <Nav />
    </div>
  );
}
