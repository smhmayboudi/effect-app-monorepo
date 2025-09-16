import { defineConfig } from "drizzle-kit"
import * as fs from "node:fs"
import * as path from "node:path"

const db = path.join(path.dirname("../../"), "../db")
const serviceId = process.env["SERVER_SERVICE_ID"] ?? "00000000-0000-0000-0000-000000000000"

try {
  fs.accessSync(db)
  console.log("Folder already exists.")
} catch {
  try {
    fs.mkdirSync(db, { recursive: true })
    console.log("Folder created successfully!")
  } catch (error) {
    console.error("Error creating folder:", error)
  }
}

export default defineConfig({
  casing: "snake_case",
  dbCredentials: { url: `file:${db}/${serviceId}-auth.sqlite` },
  dialect: "turso",
  out: `./drizzle/${serviceId}`,
  schema: "././src/infrastructure/adapter/Authentication/AuthenticationSchema.ts",
  verbose: true
})
