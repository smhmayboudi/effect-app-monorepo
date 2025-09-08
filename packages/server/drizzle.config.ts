import { defineConfig } from "drizzle-kit"

export default defineConfig({
  casing: "snake_case",
  dbCredentials: { url: "file:./db-auth.sqlite" },
  dialect: "turso",
  out: "./drizzle/",
  schema: "././src/infrastructure/adapter/Authentication/AuthenticationSchema.ts",

  verbose: true
})
