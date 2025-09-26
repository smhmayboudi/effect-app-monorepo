import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "user change-password",
  description: "user change-password",
};

export default function Page() {
  return <Client />;
}
