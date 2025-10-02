import type { Metadata } from "next";
import Client from "./client";
import { getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: Promise<{ callbackURL?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sign-in");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page(props: PageProps) {
  const { callbackURL } = await props.searchParams;

  return <Client callbackURL={callbackURL ?? "/"} />;
}
