import { revalidatePath } from "next/cache";
import { setUserLocale } from "@/i18n/user-locale";
import { COOKIE_NAME, type Locale, locales } from "@/i18n/config";
import { cookies } from "next/headers";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  async function action(data: FormData) {
    "use server";
    const locale = data.get("locale") as Locale;
    // setUserLocale(locale);
    (await cookies()).set(COOKIE_NAME, locale);
    revalidatePath("/app", "layout");
  }
  const curLocale = useLocale();

  return (
    <div>
      <form action={action}>
        {locales.map((locale) => (
          <button
            className={curLocale === locale ? "underline" : undefined}
            key={locale}
            name="locale"
            type="submit"
            value={locale}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </form>
    </div>
  );
}
