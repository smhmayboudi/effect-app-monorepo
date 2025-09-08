import type { AuthenticationError } from "@template/domain/authentication/application/AuthenticationApplicationError"
import { Context, type Effect } from "effect"
import type { auth } from "../../../infrastructure/adapter/Authentication/Authentication.js"

export class AuthenticationPortDriving extends Context.Tag("AuthenticationPortDriving")<AuthenticationPortDriving, {
  call: <A>(f: (client: typeof auth) => Promise<A>) => Effect.Effect<A, AuthenticationError, never>
}>() {}
