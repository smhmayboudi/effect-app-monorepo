import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";

const host = "http://127.0.0.1:3002";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      alternates: {
        languages: {
          de: host + (await getPathname({ href: "/", locale: "fa" })),
          es: host + (await getPathname({ href: "/", locale: "en" })),
        },
      },
      lastModified: new Date(),
      url: host,
    },
  ];
}
