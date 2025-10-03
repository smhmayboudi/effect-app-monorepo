import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  baseURL: "http://127.0.0.1:3002",
});
