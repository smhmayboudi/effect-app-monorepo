import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "sign-up",
  description: "sign-up",
};

export default function Page() {
  return <Client />;
}
