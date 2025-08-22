import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type {
  AccessToken,
  User,
  UserId,
  UserWithSensitive
} from "@template/domain/user/application/UserApplicationDomain"
import type { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import type { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import type { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Context, type Effect } from "effect"

export class UserPortDriven extends Context.Tag("UserPortDriven")<UserPortDriven, {
  create: (
    user: Omit<UserWithSensitive, "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<UserId, UserErrorEmailAlreadyTaken, never>
  delete: (id: UserId) => Effect.Effect<UserId, UserErrorNotFound, never>
  readAll: (urlParams: URLParams<User>) => Effect.Effect<SuccessArray<User, never, never>>
  readByAccessToken: (accessToken: AccessToken) => Effect.Effect<User, UserErrorNotFoundWithAccessToken, never>
  readByAccessTokens: (
    accessTokens: Array<AccessToken>
  ) => Effect.Effect<Array<User>, UserErrorNotFoundWithAccessToken, never>
  readById: (id: UserId) => Effect.Effect<User, UserErrorNotFound, never>
  readByIds: (ids: Array<UserId>) => Effect.Effect<Array<User>, UserErrorNotFound, never>
  readByIdWithSensitive: (id: UserId) => Effect.Effect<UserWithSensitive>
  update: (
    id: UserId,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, never>
}>() {}
