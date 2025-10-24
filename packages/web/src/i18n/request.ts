import { type Formats, hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { headers } from "next/headers"

import messagesDefault from "@/messages/en.json"

import { routing } from "./routing"

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  list: {
    locale: {
      localeMatcher: "lookup",
      style: "narrow",
      type: "unit",
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 2,
    },
  },
} satisfies Formats

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale
  const messagesLocale = (await import(`@/messages/${locale}.json`)).default
  const now = (await headers()).get("x-now")
  const timeZone = (await headers()).get("x-time-zone") ?? "Etc/UCT"

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
  }
})
