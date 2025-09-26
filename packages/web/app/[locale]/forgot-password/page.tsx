import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "forgot-password",
  description: "forgot-password",
};

export default function Page() {
  return <Client />;
}
