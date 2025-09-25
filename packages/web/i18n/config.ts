export const COOKIE_NAME = "NEXT_LOCALE";
export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
