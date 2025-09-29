import { authClient } from "@/util/auth-client";

export async function getSession() {
  return await authClient.getSession();
}
