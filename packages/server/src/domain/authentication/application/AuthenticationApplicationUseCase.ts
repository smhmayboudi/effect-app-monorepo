import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AuthenticationError } from "@template/domain/authentication/application/AuthenticationApplicationError"
import { Effect, Layer } from "effect"
import { authF } from "../../../infrastructure/adapter/Authentication/Authentication.js"
import { AuthenticationPortDriving } from "./AuthenticationApplicationPortDriving.js"

export const AuthenticationUseCase = Layer.scoped(
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
