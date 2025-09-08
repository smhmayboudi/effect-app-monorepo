import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, bearer, openAPI } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/libsql/node"
import { ac, roles } from "./AuthenticationAdmin.js"
import * as schema from "./AuthenticationSchema.js"

const db = drizzle({ connection: { url: "file:db-auth.sqlite" } })

export const auth = betterAuth({
  advanced: {
    cookiePrefix: "effect-app-monorepo"
    // crossSubDomainCookies: {
    //   enabled: true
    // }
    // generateId: (options): string => {
    //   // logger.assign({
    //   //   [ATTR_CODE_FUNCTION_NAME]: "generateId-advanced-auth.infrastructure",
    //   //   config,
    //   //   options
    //   // })
    //   // logger.debug({})
    //   return init({ length: options.size ?? 32 })()
    // }
  },
  appName: "@template/server",
  basePath: "/auth",
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  // disabledPaths,
  emailAndPassword: {
    autoSignIn: true,
    enabled: true
    // requireEmailVerification: true
  },
  emailVerification: {
    autoSignInAfterVerification: true
  },
  // logger: new AuthLogger(false, "debug", loggerLogger),
  onAPIError: {
    onError: (_error, _ctx) => {
      // logger.assign({
      //   [ATTR_CODE_FUNCTION_NAME]: "onError-onAPIError-auth.infrastructure",
      //   config,
      //   ctx,
      //   error
      // })
      // logger.error({})
    }
  },
  plugins: [
    admin({ ac, roles }),
    bearer(),
    // jwt({
    //   jwt: {
    //     definePayload: (_session) => {
    //       // logger.assign({
    //       //   [ATTR_CODE_FUNCTION_NAME]: "definePayload-jwt-jwt-auth.infrastructure",
    //       //   config,
    //       //   session
    //       // })
    //       // logger.debug({})

    //       return {}
    //     }
    //   }
    // }),
    openAPI()
  ],
  rateLimit: { storage: "database" },
  // secondaryStorage: new AuthSecondaryStorage(
  //   cacher,
  //   config,
  //   loggerSecondaryStorage
  // ),
  // secret: "1234567890",
  trustedOrigins: ["http://localhost:3001"]
})
