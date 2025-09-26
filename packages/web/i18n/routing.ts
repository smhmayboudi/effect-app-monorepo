import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "fa",
  localeCookie: {
    name: "__next_locale",
  },
  locales: ["en", "fa"],
});
