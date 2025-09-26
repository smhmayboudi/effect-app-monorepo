import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "fa",
  localeCookie: {
    name: "NEXT_LOCALE",
  },
  locales: ["en", "fa"],
});
