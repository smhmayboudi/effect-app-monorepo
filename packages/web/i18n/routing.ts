import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "fa",
  localeCookie: {
    // httpOnly: false,
    name: "__next_locale",
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  locales: ["en", "fa"],
});
