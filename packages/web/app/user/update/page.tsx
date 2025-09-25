import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "user update",
  description: "user update",
};

export default function Page() {
  return <Client />;
}
