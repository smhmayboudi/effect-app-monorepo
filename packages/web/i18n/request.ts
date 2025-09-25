import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";
import { getUserLocale } from "./user-locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let request = await requestLocale;
  if (!request) {
    request = await getUserLocale();
  }
  const locale = hasLocale(locales, request) ? request : defaultLocale;

  return {
    locale,
    messages: (await import(`../message/${locale}.json`)).default,
  };
});
