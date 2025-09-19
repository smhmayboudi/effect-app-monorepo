import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include"
  },
  basePath: "/auth/00000000-0000-0000-0000-000000000000",
  baseURL: "http://127.0.0.1:3001"
})
