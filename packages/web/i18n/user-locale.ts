import { cookies } from "next/headers";
import { COOKIE_NAME, type Locale, defaultLocale } from "./config";

export async function getUserLocale() {
  return ((await cookies()).get(COOKIE_NAME)?.value || defaultLocale) as Locale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
