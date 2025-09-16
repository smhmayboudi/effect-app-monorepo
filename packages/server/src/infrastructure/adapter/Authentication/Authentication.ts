import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/libsql/node"
import { Redis } from "ioredis"
import { ac, roles } from "./AuthenticationAdmin.js"
import { options } from "./AuthenticationOptions.js"
import * as schema from "./AuthenticationSchema.js"

const db = drizzle({ connection: { url: "file:db-auth.sqlite" }, logger: true })
const redis = new Redis()
const storageKey = (key: string) => `authentication:${key}`

export const auth = betterAuth({
  ...options,
  advanced: {
    cookiePrefix: "effect-app-monorepo"
  },
  appName: "@template/server",
  basePath: "/auth",
  database: drizzleAdapter(
    db,
    { debugLogs: true, provider: "sqlite", schema }
  ),
  plugins: [
    admin({ ac, roles })
  ],
  secondaryStorage: {
    delete: async (key) => {
      await redis.del(storageKey(key))
    },
    get: async (key) => {
      return await redis.get(storageKey(key))
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(storageKey(key), value, "EX", ttl)
      } else {
        await redis.set(storageKey(key), value)
      }
    }
  },
  secret: "better-auth-secret-123456789"
})

export const authF = (serviceId: ServiceId) => {
  const db = drizzle({
    connection: { url: `file:db/${serviceId}-auth.sqlite` },
    logger: true
  })
  const redis = new Redis()
  const storageKey = (key: string) => `${serviceId}:authentication:${key}`

  return betterAuth({
    ...options,
    advanced: {
      cookiePrefix: `${serviceId}.effect-app-monorepo`
    },
    appName: `${serviceId}-@template/server`,
    basePath: `/${serviceId}/auth`,
    database: drizzleAdapter(
      db,
      { debugLogs: true, provider: "sqlite", schema }
    ),
    plugins: [
      admin({ ac, roles })
    ],
    secondaryStorage: {
      delete: async (key) => {
        await redis.del(storageKey(key))
      },
      get: async (key) => {
        return await redis.get(storageKey(key))
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await redis.set(storageKey(key), value, "EX", ttl)
        } else {
          await redis.set(storageKey(key), value)
        }
      }
    },
    secret: `${serviceId}-better-auth-secret-123456789`
  })
}
