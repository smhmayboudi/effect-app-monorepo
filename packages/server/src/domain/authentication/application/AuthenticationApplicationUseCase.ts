import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AuthenticationError } from "@template/domain/authentication/application/AuthenticationApplicationError"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { authF } from "../../../infrastructure/adapter/Authentication/Authentication.js"
import { AuthenticationPortDriving } from "./AuthenticationApplicationPortDriving.js"

export const AuthenticationUseCase = Layer.effect(
  AuthenticationPortDriving,
  Effect.sync(() =>
    AuthenticationPortDriving.of((serviceId) => ({
      call: (f) =>
        Effect.tryPromise({
          try: () => f(authF(serviceId)),
          catch: (error) => new AuthenticationError({ error })
        }).pipe(
          Effect.withSpan("AuthenticationUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "call" } })
        )
    }))
  )
)
