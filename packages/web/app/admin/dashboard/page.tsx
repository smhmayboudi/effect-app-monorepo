import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "admin dashboard",
  description: "admin dashboard",
};

export default function Page() {
  <Client />;
}
