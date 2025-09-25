import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "user dashboard",
  description: "user dashboard",
};

export default function Page() {
  return <Client />;
}
