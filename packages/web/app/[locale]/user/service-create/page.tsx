import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "user service-create",
  description: "user service-create",
};

export default function Page() {
  return <Client />;
}
