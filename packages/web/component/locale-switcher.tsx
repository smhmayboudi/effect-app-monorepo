"use client";

import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useFormatter } from "next-intl";

export default function LocaleSwitcher() {
  const format = useFormatter();
  const curLocale = useLocale();
  const pathname = usePathname();

  return (
    <div>
      {format.list(
        routing.locales.map((locale) => (
          <Link
            className={curLocale === locale ? "underline" : undefined}
            href={pathname}
            key={locale}
            locale={locale}
          >
            {locale.toUpperCase()}
          </Link>
        )),
        "locale"
      )}
    </div>
  );
}
