import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/private/",
      userAgent: "*"
    },
    sitemap: "http://127.0.0.1:3002/sitemap.xml"
  }
}
