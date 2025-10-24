import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth"
import { bearer, createAuthMiddleware, openAPI } from "better-auth/plugins"
import { v7 } from "uuid"

export const options: BetterAuthOptions = {
  account: {
    accountLinking: {
      allowDifferentEmails: true,
      enabled: true,
      trustedProviders: ["email-password", "google"]
    },
    encryptOAuthTokens: true
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true
    },
    database: {
      defaultFindManyLimit: 100,
      generateId: () => v7(),
      useNumberId: false
    },
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      secure: true
    },
    disableCSRFCheck: false,
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false
    },
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  baseURL: "http://127.0.0.1:3001",
  // databaseHooks: {
  //   session: {
  //     create: {
  //       before: async (userSession) => {
  //         const membership = await db.query.member.findFirst({
  //           where: eq(member.userId, userSession.userId),
  //           orderBy: desc(member.createdAt),
  //           columns: { organizationId: true }
  //         })

  //         return {
  //           data: {
  //             ...userSession,
  //             activeOrganizationId: membership?.organizationId
  //           }
  //         }
  //       }
  //     }
  //   }
  // },
  emailAndPassword: {
    autoSignIn: false,
    disableSignUp: false,
    enabled: true,
    maxPasswordLength: 128,
    minPasswordLength: 8,
    // password: {
    //   hash: async (password) => { return hashedPassword },
    //   verify: async ({ hash, password }) => { return isValid }
    // },
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    sendResetPassword: async ({ token, url, user }) => {
      console.log({ token, url, user })
      // await sendPasswordResetEmail({ token, url, user })
    }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendOnSignUp: true,
    sendVerificationEmail: async ({ token, url, user }) => {
      console.log({ token, url, user })
      // await sendEmailVerificationEmail({ user, url })
    }
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email
        }

        if (user != null) {
          console.log({ user })
          // await sendWelcomeEmail(user)
        }
      }
    })
  },
  plugins: [
    bearer() as BetterAuthPlugin,
    // jwt({ jwt: { definePayload: (_session) => ({}) } }),
    openAPI()
  ],
  rateLimit: {
    max: 100,
    window: 10,
    enabled: true,
    storage: "secondary-storage"
  },
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
  trustedOrigins: ["http://127.0.0.1:3001", "http://127.0.0.1:3002"],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, token, url, user }) => {
        console.log({ newEmail, token, url, user })
        // await sendEmailVerificationEmail({
        //   user: { ...user, email: newEmail },
        //   url
        // })
      }
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ token, url, user }) => {
        console.log({ token, url, user })
        // await sendDeleteAccountVerificationEmail({ user, url })
      }
    }
  },
  verification: {
    disableCleanup: false
  }
}
