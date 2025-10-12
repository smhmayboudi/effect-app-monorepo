import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import Client from "./client";

export async function generateMetadata(props: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await props.params;
  const t = await getTranslations("user.service-help");

  return {
    description: t("description", { serviceId }),
    title: t("title", { serviceId }),
  };
}

export default async function Page() {
  return <Client />;
}
