import { hasLocale, IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import messagesDefault from "../message/en.json";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messagesLocale = (await import(`../message/${locale}.json`)).default;
  const now = (await headers()).get("x-now");
  const timeZone = (await headers()).get("x-time-zone") ?? "Etc/UCT";

  return {
    // formats
    getMessageFallback({ error, key, namespace }) {
      console.error({ error, key, namespace });

      return (
        "`getMessageFallback` called for " +
        [namespace, key].filter((part) => part != null).join(".")
      );
    },
    locale,
    messages: { ...messagesDefault, ...messagesLocale },
    now: now ? new Date(now) : new Date(),
    onError(error) {
      if (
        error.message ===
        (process.env.NODE_ENV === "production"
          ? IntlErrorCode.MISSING_MESSAGE
          : "MISSING_MESSAGE: Could not resolve `missing` in `Index`.")
      ) {
        // Do nothing, this error is triggered on purpose
      } else {
        console.error({ error });
      }
    },
    timeZone,
  };
});
