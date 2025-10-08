import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Debug Auth",
  description: "Debug Auth",
};

export default function Page() {
  return <Client />;
}
