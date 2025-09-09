import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, bearer, openAPI } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/libsql/node"
import { Redis } from "ioredis"
import { v7 } from "uuid"
import { ac, roles } from "./AuthenticationAdmin.js"
import * as schema from "./AuthenticationSchema.js"

const db = drizzle({ connection: { url: "file:db-auth.sqlite" }, logger: true })
const redis = new Redis()
const storageKey = (key: string) => `authentication:${key}`

export const auth = betterAuth({
  account: {
    accountLinking: {
      allowDifferentEmails: true,
      enabled: true,
      trustedProviders: ["email-password", "google"]
    },
    encryptOAuthTokens: true
  },
  advanced: {
    cookiePrefix: "effect-app-monorepo",
    // cookies: {
    //   session_token: {
    //     name: "custom_session_token",
    //     attributes: {
    //       httpOnly: true,
    //       secure: true
    //     }
    //   }
    // },
    crossSubDomainCookies: {
      enabled: true
    },
    database: {
      defaultFindManyLimit: 100,
      generateId: (_options): string => v7(),
      useNumberId: false
    },
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true
    },
    disableCSRFCheck: false,
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false
    }
    // useSecureCookies: true
  },
  appName: "@template/server",
  basePath: "/auth",
  baseURL: "http://localhost:3001",
  database: drizzleAdapter(db, { debugLogs: true, provider: "sqlite", schema }),
  emailAndPassword: {
    autoSignIn: true,
    disableSignUp: false,
    enabled: true,
    maxPasswordLength: 128,
    minPasswordLength: 8,
    // password: {
    //   hash: async (password) => { return hashedPassword },
    //   verify: async ({ hash, password }) => { return isValid }
    // },
    // requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600 // 1 hour
    // sendResetPassword: async ({ token, url, user }) => {}
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendOnSignUp: true
    // sendVerificationEmail: async ({ token, url, user }) => {}
  },
  plugins: [
    admin({ ac, roles }),
    bearer(),
    // jwt({ jwt: { definePayload: (_session) => ({}) } }),
    openAPI()
  ],
  rateLimit: {
    max: 100,
    window: 10,
    enabled: true,
    storage: "secondary-storage"
  },
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
  // secret: "better-auth-secret-123456789",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300 // 5 minutes
    },
    disableSessionRefresh: true, // Disable session refresh so that the session is not updated regardless of the `updateAge` option. (default: `false`)
    expiresIn: 604800, // 7 days
    preserveSessionInDatabase: true, // Preserve session records in database when deleted from secondary storage (default: `false`)
    storeSessionInDatabase: true, // Store session in database when secondary storage is provided (default: `false`)
    updateAge: 86400 // 1 day
  },
  telemetry: {
    debug: true,
    enabled: true
  },
  trustedOrigins: ["http://localhost:3001"],
  verification: {
    disableCleanup: false
  }
})
