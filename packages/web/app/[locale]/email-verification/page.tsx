import type { Metadata } from "next";
import Client from "./client";
import { getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: Promise<{ email: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("email-verification");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page(props: PageProps) {
  const { email } = await props.searchParams;

  return <Client email={email} />;
}
