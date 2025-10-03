import { defineConfig } from "drizzle-kit"

const serviceId = process.env["SERVER_SERVICE_ID"] ?? "00000000-0000-0000-0000-000000000000"

export default defineConfig({
  casing: "snake_case",
  dbCredentials: { url: `file:../../db-auth-${serviceId}.sqlite` },
  dialect: "turso",
  out: `./drizzle/${serviceId}`,
  schema: "./src/infrastructure/adapter/Authentication/AuthenticationSchema.ts",
  verbose: true
})
