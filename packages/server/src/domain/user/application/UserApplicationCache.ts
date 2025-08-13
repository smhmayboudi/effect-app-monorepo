import { persisted } from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AccessToken, User, UserId } from "@template/domain/user/application/UserApplicationDomain"
import { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Effect, Exit, PrimaryKey, Redacted, RequestResolver, Schema } from "effect"
import { UserConfig } from "./UserApplicationConfig.js"
import { UserPortDriven } from "./UserApplicationPortDriven.js"

export class UserReadByAccessToken extends Schema.TaggedRequest<UserReadByAccessToken>()("UserReadByAccessToken", {
  failure: UserErrorNotFoundWithAccessToken,
  payload: { accessToken: AccessToken },
  success: User
}) {
  [PrimaryKey.symbol]() {
    return `UserReadByAccessToken:${Redacted.value(this.accessToken)}`
  }
}

export class UserReadById extends Schema.TaggedRequest<UserReadById>()("UserReadById", {
  failure: UserErrorNotFound,
  payload: { id: UserId },
  success: User
}) {
  [PrimaryKey.symbol]() {
    return `UserReadById:${this.id}`
  }
}

export const makeUserReadResolver = Effect.gen(function*() {
  const { cacheTTLMs } = yield* UserConfig
  const driven = yield* UserPortDriven
  const resolver = yield* RequestResolver.fromEffectTagged<UserReadByAccessToken | UserReadById>()({
    UserReadByAccessToken: (requests) =>
      driven.readByAccessTokens(requests.map((req) => req.accessToken)).pipe(
        Effect.withSpan("UserUseCase", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "UserReadByAccessToken", requests }
        }),
        Effect.tap(() => Effect.logInfo("DB hit: UserReadByAccessToken", requests.length))
      ),
    UserReadById: (requests) =>
      driven.readByIds(requests.map((req) => req.id)).pipe(
        Effect.withSpan("UserUseCase", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "UserReadById", requests }
        }),
        Effect.tap(() => Effect.logInfo("DB hit: UserReadById", requests.length))
      )
  }).pipe(
    persisted({
      storeId: "User",
      timeToLive: (req, exit) =>
        (req._tag === "UserReadByAccessToken" &&
            Exit.isSuccess(exit as Exit.Exit<User, UserErrorNotFoundWithAccessToken>)) ?
          cacheTTLMs
          : (
              req._tag === "UserReadById" &&
              Exit.isSuccess(exit as Exit.Exit<User, UserErrorNotFound>)
            ) ?
          cacheTTLMs
          : 0
    })
  )

  return resolver
})
