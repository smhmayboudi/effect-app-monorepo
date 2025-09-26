import { type Formats, hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import messagesDefault from "../message/en.json";
import { headers } from "next/headers";

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 2,
    },
  },
  list: {
    locale: {
      localeMatcher: "lookup",
      style: "narrow",
      type: "unit",
    },
  },
} satisfies Formats;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messagesLocale = (await import(`../message/${locale}.json`)).default;
  const now = (await headers()).get("x-now");
  const timeZone = (await headers()).get("x-time-zone") ?? "Etc/UCT";

  return {
    formats,
    getMessageFallback: ({ error, key, namespace }) =>
      `'getMessageFallback' called for ${[namespace, key]
        .filter((part) => part != null)
        .join(".")}, ${JSON.stringify(error)}`,
    locale,
    messages: { ...messagesDefault, ...messagesLocale },
    now: now ? new Date(now) : new Date(),
    onError: console.error,
    timeZone,
  };
});
