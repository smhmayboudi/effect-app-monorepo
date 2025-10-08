import type { Metadata } from "next";
import Client from "./client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await props.params;
  const t = await getTranslations("user.service-help");

  return {
    title: t("title", { serviceId }),
    description: t("description", { serviceId }),
  };
}

export default async function Page() {
  return <Client />;
}
