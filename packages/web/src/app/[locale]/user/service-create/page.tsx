import type { Metadata } from "next"

import { getTranslations } from "next-intl/server"

import Client from "./client"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("user.service-create")

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default function Page() {
  return <Client />
}
