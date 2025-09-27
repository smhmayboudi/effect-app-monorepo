"use client";

import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useFormatter } from "next-intl";

export default function LocaleSwitcher() {
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
        "locale"
      )}
    </div>
  );
}
