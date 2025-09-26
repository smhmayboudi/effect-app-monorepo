import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "debug-auth",
  description: "debug-auth",
};

export default function Page() {
  return <Client />;
}
