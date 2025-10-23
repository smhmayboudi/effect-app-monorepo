import type { AuthenticationError } from "@template/domain/authentication/application/AuthenticationApplicationError"
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import type { authF } from "../../../infrastructure/adapter/Authentication/Authentication.js"

export class AuthenticationPortDriving extends Context.Tag("AuthenticationPortDriving")<
  AuthenticationPortDriving,
  (serviceId: ServiceId) => {
    call: <A>(f: (client: ReturnType<typeof authF>) => Promise<A>) => Effect.Effect<A, AuthenticationError, never>
  }
>() {}
