"use client";

import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const curLocale = useLocale();
  const pathname = usePathname();

  return (
    <div>
      {routing.locales.map((locale) => (
        <Link
          className={curLocale === locale ? "underline" : undefined}
          href={pathname}
          key={locale}
          locale={locale}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
