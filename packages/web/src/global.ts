import type { formats } from "@/i18n/request";
import type { routing } from "@/i18n/routing";
import type messages from "@/messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Formats: typeof formats;
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
