import type { Metadata } from "next";
import Client from "./client";
import { getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reset-password");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page(props: PageProps) {
  const { token } = await props.searchParams;

  return <Client token={token} />;
}
