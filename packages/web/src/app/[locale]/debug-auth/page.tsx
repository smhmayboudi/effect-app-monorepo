import Client from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debug Auth",
  description: "Debug Auth",
};

export default function Page() {
  return <Client />;
}
