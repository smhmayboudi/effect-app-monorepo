"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useFormatter } from "next-intl";

export function LocaleSwitcher() {
  const format = useFormatter();
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div>
      {format.list(
        routing.locales.map((loc) => (
          <Link
            className={loc === locale ? "underline" : undefined}
            href={pathname}
            key={loc}
            locale={loc}
          >
            {loc.toUpperCase()}
          </Link>
        )),
        "locale",
      )}
    </div>
  );
}
