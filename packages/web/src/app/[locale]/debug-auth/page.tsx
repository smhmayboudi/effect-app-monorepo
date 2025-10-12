import type { Metadata } from "next";

import Client from "./client";

export const metadata: Metadata = {
  description: "Debug Auth",
  title: "Debug Auth",
};

export default function Page() {
  return <Client />;
}
