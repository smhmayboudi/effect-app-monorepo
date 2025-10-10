import { getPathname } from "@/i18n/navigation";
import { MetadataRoute } from "next";

const host = "http://127.0.0.1:3002";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      alternates: {
        languages: {
          es: host + (await getPathname({ locale: "en", href: "/" })),
          de: host + (await getPathname({ locale: "fa", href: "/" })),
        },
      },
      lastModified: new Date(),
      url: host,
    },
  ];
}
