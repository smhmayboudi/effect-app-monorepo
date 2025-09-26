import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "sign-in",
  description: "sign-in",
};

export default function Page() {
  return <Client />;
}
