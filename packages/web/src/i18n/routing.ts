import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  localeCookie: {
    // httpOnly: false,
    name: "__next_locale",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
    secure: process.env.NODE_ENV === "production",
  },
  locales: ["en", "fa"],
});
