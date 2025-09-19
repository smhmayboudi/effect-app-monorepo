import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import type { BetterAuthOptions } from "better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { deepmerge } from "deepmerge-ts"
import { drizzle } from "drizzle-orm/libsql/node"
import { Redis } from "ioredis"
import { ac, roles } from "./AuthenticationAdmin.js"
import { options } from "./AuthenticationOptions.js"
import * as schema from "./AuthenticationSchema.js"

const db = drizzle({ connection: { url: "file:db-auth.sqlite" }, logger: true })
const redis = new Redis()
const storageKey = (key: string) => `authentication:${key}`

export const auth = betterAuth(
  deepmerge(
    options,
    {
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
            await redis.set(storageKey(key), value, "EX", Math.round(ttl))
          } else {
            await redis.set(storageKey(key), value)
          }
        }
      },
      secret: "better-auth-secret-123456789"
    } satisfies BetterAuthOptions
  ) as BetterAuthOptions
)

export const authF = (serviceId: ServiceId) => {
  const db = drizzle({
    connection: { url: `file:db-auth-${serviceId}.sqlite` },
    logger: true
  })
  const redis = new Redis()
  const storageKey = (key: string) => `authentication:${serviceId}:${key}`

  return betterAuth(
    deepmerge(
      options,
      {
        advanced: {
          cookiePrefix: `effect-app-monorepo-${serviceId}`
        },
        appName: `@template/server/${serviceId}`,
        basePath: `/auth/${serviceId}`,
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
              await redis.set(storageKey(key), value, "EX", Math.round(ttl))
            } else {
              await redis.set(storageKey(key), value)
            }
          }
        },
        secret: `better-auth-secret-123456789-${serviceId}`
      } satisfies BetterAuthOptions
    ) as BetterAuthOptions
  )
}
