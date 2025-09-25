import type { Metadata } from "next";
import Client from "./client";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { serviceId } = await props.params;

  return {
    title: `user service-help ${serviceId}`,
    description: `user service-help ${serviceId}`,
  };
}

export default async function Page(props: PageProps) {
  const { serviceId } = await props.params;

  return <Client serviceId={serviceId} />;
}
